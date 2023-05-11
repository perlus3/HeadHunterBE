import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {}

  async validateUsername(username: string): Promise<boolean> {
    const response = await lastValueFrom(
      this.httpService.get(`https://api.github.com/users/${username}`),
    );

    return response.status === 200;
  }
}
