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
  if (email === undefined) {
    throw new BadRequestException('Zapomniałeś dodać emaila');
  }
  if (!email.includes('@')) {
    throw new BadRequestException('Email musi zawierać @');
  }
};

export const checkGrade = (grade: number) => {
  if (grade === undefined) {
    throw new BadRequestException(
      'Podaj ocenę! Ocena musi mieścić się w przedziale 0–5',
    );
  }

  if (grade < 0 || grade > 5 || !Number.isInteger(grade)) {
    throw new BadRequestException('Ocena musi wynosić między 0-5');
  }
};
