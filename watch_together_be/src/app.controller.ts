import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './authentication/guards/auth.guard';
import { TmdbProxyDto, RequestWithUser } from './shared/shared.interface';
import { SharedService } from './shared/shared.service';

@Controller()
export class AppController {
  constructor(private readonly sharedService: SharedService, private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('tmdb-proxy-mock/:tmdbPath')
  async tmdbProxyMock(@Body() delay: { minDelay: number, maxDelay: number }) {
    await this.sharedService.randomDelay(delay.minDelay, delay.maxDelay)
    return {}
  }

  @UseGuards(AuthGuard)
  @Post('tmdb-proxy')
  async tmdbProxy(@Req() request: RequestWithUser, @Body() body: TmdbProxyDto) {
    return await this.sharedService.tmdbProxy(request.user, body);
  }

  @UseGuards(AuthGuard)
  @Get('server-time')
  async getServerTime() {
    return { timestamp: Date.now() }
  }

}
