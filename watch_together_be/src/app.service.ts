import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { User } from './user/entities/user.entity';
import { TmdbProxyDto } from './app.interface';
import { response } from 'express';

@Injectable()
export class AppService {

  constructor(private httpService: HttpService, private configService: ConfigService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async tmdbProxy(user: User, tbmdProxyDto: TmdbProxyDto) {
    const { uri, method, body, headers } = tbmdProxyDto;
    const apiKey = this.configService.get('TMDB_API_KEY');
    const tmdbBaseUrl = this.configService.get('TMDB_API_BASE_URL');
    const sessionId = user.tmdbSessionId;
    const url = uri.includes('?') ? `${tmdbBaseUrl}${uri}&api_key=${apiKey}&session_id=${sessionId}` : `${tmdbBaseUrl}${uri}?api_key=${apiKey}&session_id=${sessionId}`;
    Logger.log(url, 'tmdbProxy');
    if (body && method === 'get') {
      throw new BadRequestException('GET requests cannot have a body');
    }

    let options: AxiosRequestConfig = { url, method };
    body ? options = { ...options, data: body } : null;
    headers ? options = { ...options, headers } : null;

    try {
      const response = await firstValueFrom(this.httpService.request(options).pipe(map(response => response.data)));
      return response;
    } catch (error) {
      Logger.error(error.errors);
      throw new HttpException(error.response.data.status_message, error.response.status);
    }
  }

}
