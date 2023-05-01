import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UsersEntity } from 'src/entities/users.entity';

import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { config } from 'src/config/config';
import { compare } from 'bcrypt';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: string;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = config.JWT_EXPIRES_ACCESS;
    const accessToken = sign(
      payload,
      config.JWT_SECRET,

      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: UsersEntity): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await UsersEntity.findOne({
        where: { currentTokenId: token },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();
    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await UsersEntity.findOne({
        where: {
          email: req.email,
        },
      });
      if (!user) {
        return res.json({ error: 'Not user found with given email!' });
      }
      const match = await compare(req.pwd, user.pwd);
      if (!match) {
        return res.json({ error: 'Invalid login data!' });
      }

      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          secure: false, //jeśli localHost to false jesli bedzie na stronie 'https' to wtedy true
          domain: 'localhost', // zmienić na właściwy adres jeśli wypuszczamy na prod.
          httpOnly: true,
        })
        .json({ ok: true, id: user.id, role: user.role });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: UsersEntity, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
