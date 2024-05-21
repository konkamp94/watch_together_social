import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [AuthenticationModule, TypeOrmModule.forFeature([User])],
    providers: [NotificationGateway],
    exports: [NotificationGateway]
})
export class GatewayModule { }
