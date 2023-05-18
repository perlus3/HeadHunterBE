import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto } from '../dtos/auth-login.dto';
import { UsersEntity } from 'src/entities/users.entity';

import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { config } from 'src/config/config';
import { JwtPayload } from './jwt.strategy';
import { compareMethod } from '../utils/hash-password';

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
        return res.json({
          error: 'Nie znaleziono użytkownika o podanym e-mailu!',
        });
      }
      if (!user.isActive) {
        return res.json({ error: 'Your account is deactivated!' });
      }
      const match = await compareMethod(req.pwd, user.pwd);
      if (!match) {
        return res.json({ error: 'Nieprawidłowe dane logowania!' });
      }

      const token = this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          secure: false, //jeśli localHost to false jesli bedzie na stronie 'https' to wtedy true
          domain: 'localhost', // zmienić na właściwy adres jeśli wypuszczamy na prod.
          httpOnly: true,
        })
        .json({ ok: true, id: user.id, role: user.role, email: user.email });
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
