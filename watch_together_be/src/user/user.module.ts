import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Friendship } from 'src/social/entities/friendship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendship])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
