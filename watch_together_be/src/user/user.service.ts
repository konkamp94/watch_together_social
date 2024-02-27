import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async createOrUpdateUserWithTmdbInfo(tmdbSessionAndUserDetails: TmdbSessionAndUserDetails): Promise<User> {
        // Check if user already exists
        let user = await this.userRepository.findOne({ where: { tmdbId: tmdbSessionAndUserDetails.userDetails.id } });
        if (!user) {
            user = new User();
            user.username = tmdbSessionAndUserDetails.userDetails.username;
            user.tmdbId = tmdbSessionAndUserDetails.userDetails.id;
        }

        user.name = tmdbSessionAndUserDetails.userDetails.name;
        user.tmdbSessionId = tmdbSessionAndUserDetails.sessionId;
        return await this.userRepository.save(user);
    }

    // TODO: add an expiration date to the database for the token
    // TODO: add one-to-many relationship with the refresh token (multiple devices)
    async storeRefreshToken(user: User, refreshToken: string) {
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.save(user);
    }
}
