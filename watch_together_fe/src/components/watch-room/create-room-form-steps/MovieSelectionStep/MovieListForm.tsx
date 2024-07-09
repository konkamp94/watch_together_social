import { Grid } from '@mui/material';
import { MovieWithGenres, MovieWithGenresAndState } from '../../../../services/api.interfaces';
import MovieInListForm from './MovieInListForm';

const MovieList = ({movies, selectedMovieId, formAction = () => {}} : {movies: MovieWithGenres[] | MovieWithGenresAndState[], selectedMovieId: number | undefined, formAction?: (movieInfo: {movieId: number, movieTitle: string}) => void}) => {
     return (
            <Grid container spacing={2} className='grid-container-custom'>
                {
                    movies.map((movie) =>
                    <Grid key={movie.id} item className='grid-item-custom' xs={12} sm={6} md={3} lg={3} sx={{padding: '4px'}}>
                        <MovieInListForm key={movie.id} movie={movie} formAction={formAction} isSelectedMovie={movie.id === selectedMovieId} />
                    </Grid>
                )}
            </Grid>
     )
}

export default MovieList