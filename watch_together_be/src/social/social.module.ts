import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { BlockedUser } from 'src/user/entities/blocked-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User, BlockedUser]), AuthenticationModule],
  controllers: [SocialController],
  providers: [SocialService]
})
export class SocialModule { }
