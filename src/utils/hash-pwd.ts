import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac(
    'sha512',
    'kjhKJHkjhh^%^4HGJHVJHGKJUT&JH HGJHGJHgjyg jhgj ws675 i7^ * 76 uy*&6IYKJH iuy i76 HG & jhgjhgjh v657%76%&^$^%$**^*&%^%$%#ncfhgfBVtyr67%$^&546758^876ytuhgNNV  jHGjgjhr6754&^$&^57 V&^875*&%868768 6igjhgjgulhfHG i6*^87%^*%BNGJHG khKJ kjhK khkjh KYp9y YH O87 O(*& o97 o97y iUH * &YOUGKJHGHgljhkjhfjhjh',
  );
  hmac.update(p);
  return hmac.digest('hex');
};
