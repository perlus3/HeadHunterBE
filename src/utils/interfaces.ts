import { Request } from 'express';
import { UsersEntity } from '../entities/users.entity';

interface RequestWithUser extends Request {
  user: UsersEntity;
}

export default RequestWithUser;
