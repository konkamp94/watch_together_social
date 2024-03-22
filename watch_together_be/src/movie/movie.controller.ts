import { Controller, Get, HttpException, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/authentication/guards/auth.guard';
import { RequestWithUser } from '../shared/shared.interface';
import { SharedService } from 'src/shared/shared.service';

@Controller('movie')
export class MovieController {
    constructor(private sharedService: SharedService) { }

    @UseGuards(AuthGuard)
    @Get('random-movie-id')
    async getRandomMovieId(@Req() request: RequestWithUser, @Query() query) {
        const user = request.user;
        const randomMovieFrom = query['from'];

        const tmdbProxyBody = {
            uri: randomMovieFrom === 'favorites' ? `/account/${user.tmdbId}/favorite/movies` :
                randomMovieFrom === 'watchlist' ? `/account/${user.tmdbId}/watchlist/movies`
                    : '/movie/popular',
            method: 'GET'
        }

        const tmdbResponse = await this.sharedService.tmdbProxy(user, tmdbProxyBody);
        const randomPage = await this.sharedService.getRandomPageFromTmdbResponse(tmdbResponse);
        tmdbProxyBody.uri = `${tmdbProxyBody.uri}?page=${randomPage}`;
        const tmdbResponsePage = await this.sharedService.tmdbProxy(user, tmdbProxyBody);
        const randomIndex = await this.sharedService.getRandomIndexFromTmdbResponse(tmdbResponsePage);
        if (tmdbResponsePage.results.length === 0) {
            throw new HttpException(`No movies found ${"in" + randomMovieFrom}`, 404);
        }

        return {
            randomMovieTitle: tmdbResponsePage.results[randomIndex].title,
            randomMovieId: tmdbResponsePage.results[randomIndex].id
        };

    }

    // returns a random page of recommended movies for a given movieId
    @UseGuards(AuthGuard)
    @Get('recommended-movies')
    async getRecommendedMovies(@Req() request: RequestWithUser, @Query() query) {
        const user = request.user;
        const randomMovieId = query['movieId'];
        if (!randomMovieId) {
            throw new HttpException('movieId query param is required', 400);
        }

        const tmdbProxyBody = {
            uri: `/movie/${randomMovieId}/recommendations`,
            method: 'GET'
        }

        const tmdbResponse = await this.sharedService.tmdbProxy(user, tmdbProxyBody);
        const randomPage = await this.sharedService.getRandomPageFromTmdbResponse(tmdbResponse);

        // new response with random page
        tmdbProxyBody.uri = `${tmdbProxyBody.uri}?page=${randomPage}`;
        return await this.sharedService.tmdbProxy(user, tmdbProxyBody);

    }
}
