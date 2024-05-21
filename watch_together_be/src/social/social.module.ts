import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { BlockedUser } from 'src/user/entities/blocked-user.entity';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Notification, User, BlockedUser]), AuthenticationModule, GatewayModule],
  controllers: [SocialController],
  providers: [SocialService]
})
export class SocialModule { }
