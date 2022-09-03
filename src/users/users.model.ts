import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Market } from '../market/market.model';

// export interface UserStocksOwned extends mongoose.Document {
//   _id: string;
//   stock_id: string;
//   stock_name: string;
//   stock_price: number;
//   no_of_stocks: number;
// }

@Schema()
export class CompaniesOwned {
  @Prop()
  stock_id: string;

  @Prop({ type: String })
  company_name: Market['company_name'];

  @Prop()
  stock_price_total: number;
  @Prop()
  stock_price_each: number;

  @Prop()
  no_of_stocks_owned: number;
}

// -------------

@Schema({
  timestamps: true,
  collection: 'user',
})
export class User {
  // @Prop({ type: mongoose.Types.ObjectId, required: false })
  _id?: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: Number, default: 0 })
  companies_owned_count: number;

  @Prop([{ type: CompaniesOwned, required: false, default: [] }])
  companies_owned: CompaniesOwned[];

  @Prop({ type: Number, required: true, default: 10000 })
  bank_balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// export const userStocksOwned = new Schema(
//   {
//     stock_id: { type: Schema.Types.ObjectId, required: true },
//     stock_name: { type: String, required: true },
//     stock_price: { type: Number, required: true },
//     no_of_stocks: { type: Number, required: true, default: 1 },
//   },
//   { timestamps: true },
// );

// export const UserSchema = new Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     stocks_owned_count: { type: Number, required: false, default: 0 },
//     stocks_owned: {
//       type: [userStocksOwned],
//       required: false,
//     },
//     bank_balance: { type: Number, required: false, default: 100 },
//   },
//   {
//     timestamps: true,
//   },
// );

// export interface User extends Document {
//   _id: string;
//   username: string;
//   password: string;
// }
