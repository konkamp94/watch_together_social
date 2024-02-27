import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>, private readonly httpService: HttpService,
        private jwtService: JwtService,
        private configService: ConfigService) { }

    private createTmdbHeaders() {
        return {
            'Authorization': `Bearer ${this.configService.get('TMDB_API_READ_ACCESS_TOKEN')}`,
        }
    }

    private async createTmdbSession(requestToken: string): Promise<string> {
        const createSessionUrl = `${this.configService.get('TMDB_API_BASE_URL')}/authentication/session/new`;
        try {
            const response = await firstValueFrom(this.httpService.post(createSessionUrl, { request_token: requestToken },
                { headers: this.createTmdbHeaders() }).pipe(map(response => response.data)));
            return response.session_id;
        } catch (error) {
            Logger.error(error.response.data.status_message, 'createTmdbSession');
            const errorResponse = error.response;
            throw new HttpException(errorResponse.data.status_message, errorResponse.status)
        }
    }

    private async getTmdbUserDetails(sessionId: string): Promise<UserDetailsResponseFromTmdb> {
        const userDetailsUrl = `${this.configService.get('TMDB_API_BASE_URL')}/account?session_id=${sessionId}`;
        try {
            const response = await firstValueFrom(this.httpService.get(userDetailsUrl, { headers: this.createTmdbHeaders() }));
            return response.data;
        } catch (error) {
            Logger.error(error.response.data.status_message, 'getTmdbUserDetails');
            const errorResponse = error.response;
            throw new HttpException(errorResponse.data.status_message, errorResponse.status)
        }
    }

    async getTmdbRequestToken(): Promise<TmdbRequestTokenResponse> {
        const requestTokenUrl = `${this.configService.get('TMDB_API_BASE_URL')}/authentication/token/new`;
        const permissionUrl = `${this.configService.get('TMDB_PERMISSION_BASE_URL')}/authenticate/`;
        try {
            const response = await firstValueFrom(this.httpService.get(requestTokenUrl,
                { headers: this.createTmdbHeaders() }).pipe(map(response => response.data)));
            return {
                requestToken: response.request_token,
                redirectUrl: `${permissionUrl}${response.request_token}?redirect_to=${this.configService.get('FRONTEND_URL')}`
            }
        } catch (error) {
            Logger.error(error.response.data.status_message, 'getTmdbRequestToken');
            const errorResponse = error.response;
            throw new HttpException(errorResponse.data.status_message, errorResponse.status)
        }
    }

    async getTmdbSessionAndUserDetails(requestToken: string): Promise<TmdbSessionAndUserDetails> {
        const sessionId = await this.createTmdbSession(requestToken);
        const userDetails = await this.getTmdbUserDetails(sessionId);
        return { sessionId, userDetails };
    }

    async checkRefreshTokenValidity(refreshToken: RefreshToken): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: refreshToken.userId } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        if (!user.refreshToken) {
            throw new HttpException('User has no refresh token', 401);
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken.refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new HttpException('Invalid refresh token', 401);
        }
        return user;
    }

    private generateAccessToken(user: User): string {
        return this.jwtService.sign({ userId: user.id, username: user.username, name: user.name });
    }

    private generateRefreshToken(): string {
        return uuid();
    }

    generateTokens(user: User): AuthenticationTokens {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken();

        return { accessToken, refreshToken };
    }

    async logout(user: User) {
        user.refreshToken = null;
        user.tmdbSessionId = null;
        await this.userRepository.save(user);
    }

}