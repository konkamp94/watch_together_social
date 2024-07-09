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
import { SharedModule } from 'src/shared/shared.module';
import { WatchRoom } from './entities/watch-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Notification, WatchRoom, User, BlockedUser]), AuthenticationModule, GatewayModule, SharedModule],
  controllers: [SocialController],
  providers: [SocialService]
})
export class SocialModule { }
