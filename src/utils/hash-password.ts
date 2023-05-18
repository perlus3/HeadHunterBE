import { compare, genSalt, hash } from 'bcrypt';

export async function hashMethod(password: string): Promise<string> {
  const salt = await genSalt();

  return hash(password, salt);
}

export async function compareMethod(
  password: string,
  hashPassword: string,
): Promise<boolean> {
  return compare(password, hashPassword);
}
