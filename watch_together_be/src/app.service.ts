import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { User } from './user/entities/user.entity';
import { response } from 'express';

@Injectable()
export class AppService {

  constructor(private httpService: HttpService, private configService: ConfigService) { }

  getHello(): string {
    return 'Hello World!';
  }

}
