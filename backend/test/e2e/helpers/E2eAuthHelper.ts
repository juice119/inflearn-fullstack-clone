import { JwtService } from '@nestjs/jwt';
import { e2eAppConfig } from './e2eAppConfig';

export class E2eAuthHelper {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({ secret: e2eAppConfig.jwt.authSecret });
  }

  createAccessToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
