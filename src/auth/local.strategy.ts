import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userName: string, password: string) {
    const username = userName.toLowerCase();
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return {
        msg: 'user doesnt exist',
      };
    }
    return user;
  }
}
