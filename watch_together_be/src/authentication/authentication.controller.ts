import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './guards/auth.guard';
import { RequestWithUser } from 'src/app.interface';

@Controller('authentication')
export class AuthenticationController {

    constructor(private authService: AuthenticationService, private userService: UserService) { }

    @Get('/get-tmdb-request-token')
    async getTmdbRequestToken(): Promise<TmdbRequestTokenResponse> {
        return await this.authService.getTmdbRequestToken();
    }

    @Get('/sign-up-or-login')
    async singUpOrLogin(@Query('requestToken') requestToken: string): Promise<AuthenticationTokens> {
        const tmdbSessionAndUserDetails = await this.authService.getTmdbSessionAndUserDetails(requestToken);
        const user = await this.userService.createOrUpdateUserWithTmdbInfo(tmdbSessionAndUserDetails);
        const tokens = this.authService.generateTokens(user);
        await this.userService.storeRefreshToken(user, tokens.refreshToken);
        //TODO send refresh token in a secure httpOnly cookie
        return tokens;
    }

    @Post('/refresh-token')
    async refreshToken(@Body() refreshToken: RefreshToken): Promise<AuthenticationTokens> {
        const user = await this.authService.checkRefreshTokenValidity(refreshToken);
        const tokens = this.authService.generateTokens(user);
        await this.userService.storeRefreshToken(user, tokens.refreshToken);
        return tokens;
    }

    @UseGuards(AuthGuard)
    @Get('/logout')
    async logout(@Req() request: RequestWithUser) {
        const user = request['user'];
        await this.authService.logout(user);
        return {}
    }
}