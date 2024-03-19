import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { User } from '../user/entities/user.entity';
import { TmdbProxyDto } from './shared.interface';

@Injectable()
export class SharedService {
    constructor(private httpService: HttpService, private configService: ConfigService) { }

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

    // it returns a random page number from the total pages of a tmdb response
    async getRandomPageFromTmdbResponse(tmdbResponse) {
        let totalPages = tmdbResponse.total_pages;

        // api support paging up to 500 pages
        if (totalPages > 500) {
            totalPages = 500;
        }
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        return randomPage;
    }

    async getRandomIndexFromTmdbResponse(tmdbResponse) {
        const randomIndex = Math.floor(Math.random() * tmdbResponse.results.length);
        return randomIndex;
    }
}
