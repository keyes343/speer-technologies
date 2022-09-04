import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, CompaniesOwned } from '../users/users.model';
import { Market } from './market.model';
import { Document } from 'mongoose';
import { MarketGateway } from './market.gateway';

// type PayloadUpdateCoreCompany = {
//   company_name: keyof AllCompanies['company_name'];
//   //   stock_price: number;
//   action: 'add' | 'remove';
//   quantity: number;
//   userId: string;
// };

@Injectable()
export class MarketService {
  constructor(
    @Inject(forwardRef(() => MarketGateway))
    private gateway: MarketGateway,
    @InjectModel('market') private readonly market: Model<Market>,
    @InjectModel('user') private readonly user: Model<User>,
  ) {}

  async userAction_onStock(
    userId: string,
    company_name: string,
    action: 'buy' | 'sell',
    quantity: number,
  ) {
    const company = await this.market.findOne({ company_name });
    const user = await this.user.findById(userId);
    const remainings_stocks = company.remaining_stocks;
    const index_of_stock_in_user_profile = user.companies_owned.findIndex(
      (owned) => owned.company_name === company.company_name,
    );

    // // user wants to buy
    if (
      action === 'buy' &&
      remainings_stocks > quantity &&
      user.bank_balance > quantity * company.price_per_stock
    ) {
      const user_after_buying_stocks = await this.user_just_bought_some_stocks(
        user,
        company,
        quantity,
        index_of_stock_in_user_profile,
      );

      return { user_after_buying_stocks };
    }

    // // user wants to sell
    if (action === 'sell' && index_of_stock_in_user_profile > -1) {
      const no_of_stocks_the_user_holds =
        user.companies_owned[index_of_stock_in_user_profile].no_of_stocks_owned;
      // user has sufficient stocks to execute sell comman
      if (no_of_stocks_the_user_holds >= quantity) {
        const user_after_selling_some_shares =
          await this.user_just_sold_some_stocks(
            user,
            company,
            quantity,
            index_of_stock_in_user_profile,
            no_of_stocks_the_user_holds,
          );

        return { user_after_selling_some_shares };
      }
    }

    console.log({
      action,
      company,
      quantity,
      remainings_stocks,
      index_of_stock_in_user_profile,
    });

    return false;
  }

  async user_just_bought_some_stocks(
    user: Document & User,
    market: Document & Market,
    quantity: number,
    index_of_stock_in_user_profile: number,
  ) {
    // console.log({ user_owned_companies1: user.companies_owned });

    // user does not own this stock
    if (index_of_stock_in_user_profile < 0) {
      console.log('user does not own this stock');
      user.companies_owned_count++;
      user.companies_owned.push({
        company_name: market.company_name,
        stock_id: market._id,
        stock_price_total: market.price_total,
        stock_price_each: market.price_per_stock,
        no_of_stocks_owned: quantity,
      });
      console.log({ user_after_pushing_company: user });
      // user owns this stock
    } else {
      console.log('user owns this stock');

      user.companies_owned[index_of_stock_in_user_profile].no_of_stocks_owned +=
        quantity;
      user.companies_owned[index_of_stock_in_user_profile].stock_price_total =
        market.price_total;
      user.companies_owned[index_of_stock_in_user_profile].stock_price_each =
        market.price_per_stock;
    }

    console.log('deducting money now');
    // deduct money from user bank balance
    user.bank_balance = user.bank_balance - quantity * market.price_per_stock;
    await user.save();

    // console.log({ user_owned_companies2: user.companies_owned });

    // reduce quantity from core company and increase price
    market.price_per_stock += quantity;
    market.remaining_stocks -= quantity;
    market.price_total = market.remaining_stocks * market.price_per_stock;
    await market.save();

    this.gateway.server.emit('afterUserAction', user);

    console.log('returning user after buying');
    console.log({ user });
    return { user };
  }

  async user_just_sold_some_stocks(
    user: Document<unknown, any, User> &
      User &
      Required<{
        _id: string;
      }>,
    market: Document<unknown, any, Market> &
      Market &
      Required<{
        _id: string;
      }>,
    quantity: number,
    index_of_stock_in_user_profile: number,
    no_of_stocks_owned_by_user: number,
  ) {
    // if all stocks are being sold
    if (no_of_stocks_owned_by_user === quantity) {
      user.companies_owned_count--;
      user.companies_owned.splice(index_of_stock_in_user_profile, 1);
    } else {
      user.companies_owned[index_of_stock_in_user_profile].no_of_stocks_owned -=
        quantity;
      user.companies_owned[index_of_stock_in_user_profile].stock_price_total =
        market.price_total;
      user.companies_owned[index_of_stock_in_user_profile].stock_price_each =
        market.price_per_stock;
    }

    // put money into user bank balance
    user.bank_balance = user.bank_balance + quantity * market.price_per_stock;
    await user.save();

    // reduce the price by 1
    market.price_per_stock -= quantity;
    // add stock quantity to document
    market.remaining_stocks += quantity;
    // re-calculate total price
    market.price_total = market.remaining_stocks * market.price_per_stock;
    await market.save();

    this.gateway.server.emit('afterUserAction', user);

    return { user };
  }

  // testt(body) {
  //   console.log('testt happenning');
  //   console.log({ body });
  //   this.gateway.server.emit('testt', { body });
  // }
}
