import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(protected jwtService: JwtService, protected configService: ConfigService,
        @InjectRepository(User) protected userRepository: Repository<User>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                }
            );
            request['user'] = await this.userRepository.findOne({
                where: { id: payload.userId },
            });
            if (!request['user']) {
                throw new UnauthorizedException('User not found in the database');
            }
        } catch (error) {
            Logger.warn(this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SECRET') }))
            Logger.error(error, 'AuthGuard');
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}