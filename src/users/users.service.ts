import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async insertUser(userName: string, password: string) {
    const username = userName.toLowerCase();
    const already_exists = await this.userModel.findOne({ username: 'max' });
    if (already_exists) {
      return false;
    }
    const newUser = new this.userModel({
      username,
      password,
    });
    await newUser.save();
    return newUser;
  }

  async getUser(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    return user;
  }

  async addBalance(additional_balance: number, userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    user.bank_balance += additional_balance;
    await user.save();
    return { user };
  }
}
