import { GenresMap } from "../context/interfaces.context"
import { Genre, Movie, MovieWithAccountState, MovieWithGenres, MovieWithGenresAndState } from "../services/api.interfaces"

export const mapMoviesWithGenres = (movies: Movie[] | MovieWithAccountState[], genres: GenresMap) => {
    const moviesWithGenres: (MovieWithGenres | MovieWithGenresAndState)[] = []
    movies.forEach((movie: Movie | MovieWithAccountState) => {
        const movieGenres: Genre[] = []
        movie.genre_ids.forEach(genreId => {
            movieGenres.push({ id: genreId, name: genres[genreId] })
        })
        moviesWithGenres.push({ ...movie, genres: movieGenres })
    })

    return moviesWithGenres as MovieWithGenres[] | MovieWithGenresAndState[]
}