import {
  Controller,
  Body,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/Signup')
  async addUser(
    @Body('username') userName: string,
    @Body('password') userPassword: string,
  ) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
    const result = await this.userService.insertUser(userName, hashedPassword);

    if (!result) {
      return {
        msg: 'username already exists',
      };
    }

    return {
      msg: 'User successfully registered',
      userId: result.id,
      userName: result.username,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    return {
      User: req.user,
      msg: 'user logged in',
    };
  }
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/profile')
  async getProfile(@Body() body: { userId: string }) {
    const user = await this.userService.getProfile(body.userId);
    return user;
  }

  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return {
      msg: 'The user session has ended',
    };
  }

  @Post('/add_balance')
  async addBalance(
    @Body() body: { additional_balance: number; userId: string },
  ) {
    const user = await this.userService.addBalance(
      body.additional_balance,
      body.userId,
    );
    return user;
  }
}
