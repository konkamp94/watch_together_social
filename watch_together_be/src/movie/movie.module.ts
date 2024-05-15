import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule { }
