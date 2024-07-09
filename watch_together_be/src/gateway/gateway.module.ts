import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { WatchRoomGateway } from './watch-room.gateway';
import { WatchRoom } from 'src/social/entities/watch-room.entity';

@Module({
    imports: [AuthenticationModule, TypeOrmModule.forFeature([User, WatchRoom])],
    providers: [NotificationGateway, WatchRoomGateway],
    exports: [NotificationGateway]
})
export class GatewayModule { }
