import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './authentication/guards/auth.guard';
import { TmdbProxyDto, RequestWithUser } from './app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @Post('tmdb-proxy')
  async tmdbProxy(@Req() request: RequestWithUser, @Body() body: TmdbProxyDto) {
    return await this.appService.tmdbProxy(request['user'], body);
  }
}
