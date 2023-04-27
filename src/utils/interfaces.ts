import { UsersEntity } from '../entities/users.entity';

export interface RequestWithUser extends Request {
  user: UsersEntity;
}
