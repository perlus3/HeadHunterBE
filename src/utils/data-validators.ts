import { BadRequestException } from '@nestjs/common';

export const checkLinksToGithub = (links: string[]) => {
  if (links === undefined) {
    throw new BadRequestException('Musisz podać jakiś link do repozytorium!');
  }
  for (const link of links) {
    if (!link.includes('github.com/')) {
      throw new BadRequestException('To musi być link do repozytorium github!');
    }
  }
};
export const checkEmail = (email: string) => {
  console.log(email);
  if (email === undefined) {
    throw new BadRequestException('Zapomniałeś dodać emaila');
  }
  if (!email.includes('@')) {
    throw new BadRequestException('Email musi zawierać @');
  }
};

export const checkGrade = (grade: string) => {
  if (grade === undefined) {
    throw new BadRequestException('Podaj ocene! Ocena musi wynosić między 0-5');
  }
  if (
    grade !== '0' &&
    grade !== '1' &&
    grade !== '2' &&
    grade !== '3' &&
    grade !== '4' &&
    grade !== '5'
  ) {
    throw new BadRequestException('Ocena musi wynosić między 0-5');
  }
};
