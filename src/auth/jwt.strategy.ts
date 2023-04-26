import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from '../entities/users.entity';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey:
        'JH h H kJH Jkghghgjhg ujy%^%&^%76 65^%^&% &^% hg6576 jg jG UY JG jt76t 6tjhkjf76576&^%&^%&^5u5 u uytJGJHGKJHG kytu65&^%&^ jgj g u7 jt uhjgkgjhj hgk',
    });
  }
  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await UsersEntity.findOne({
      where: {
        currentTokenId: payload.id,
      },
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
