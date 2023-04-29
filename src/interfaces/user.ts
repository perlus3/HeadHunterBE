export interface UserEntity {
  id: string;
  email: string;
}

export interface WrongEmailAdr {
  isEmail: false;
}

export interface AlreadyTakenEmailAdr {
  isSuccess: false;
  isNewEmail: false;
}

export type RegisterUser = UserEntity | WrongEmailAdr | AlreadyTakenEmailAdr;
