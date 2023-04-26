import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { hashPwd } from 'src/utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(
      payload,
      'JH h H kJH Jkghghgjhg ujy%^%&^%76 65^%^&% &^% hg6576 jg jG UY JG jt76t 6tjhkjf76576&^%&^%&^5u5 u uytJGJHGKJHG kytu65&^%&^ jgj g u7 jt uhjgkgjhj hgk',
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
          pwdHash: hashPwd(req.pwd),
        },
      });
      if (!user) {
        return res.json({ error: 'Invalid login data!' });
      }
      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          secure: false, //jeśli localHost to false jesli bedzie na stronie 'https' to wtedy true
          domain: 'localhost', // zmienić na właściwy adres jeśli wypuszczamy na prod.
          httpOnly: true,
        })
        .json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
