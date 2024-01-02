import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/tokenpayload.interface';
import { User } from 'entities/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}
  async login(user: User, response: Response): Promise<String> {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      userUsername: user.username,
      userRoleName: user.role_name,
      userRoleCode: user.role_code,
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('APP_JWT_EXPIRATION'));

    const token = this.jwtService.sign(tokenPayload);

    // Stamp Signin
    await this.usersService.updateSignedIn(tokenPayload.userId, new Date());

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }
}
