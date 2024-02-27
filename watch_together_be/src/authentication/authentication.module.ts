import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User]), HttpModule, JwtModule.registerAsync({
    useFactory: async (configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: parseInt(
          configService.get<string>(
            'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
          ),
        ),
      },
    }),
    inject: [ConfigService],
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
