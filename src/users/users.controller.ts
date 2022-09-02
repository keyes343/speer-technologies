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

  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return {
      msg: 'The user session has ended',
    };
  }
}
