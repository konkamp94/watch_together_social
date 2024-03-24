import { Grid } from '@mui/material';
import { MovieWithAccountState, Movie } from '../../services/api.interfaces';
import MovieInList from './MovieInList';

const MovieList = ({movies, isFavoriteMode = false} : {movies: MovieWithAccountState[] | Movie[], isFavoriteMode: boolean}) => {
     return (
            <Grid container spacing={2} className='grid-container-custom'>
                {
                    movies.map((movie) =>
                    <Grid key={movie.id} item className='grid-item-custom' xs={12} sm={6} md={3} lg={3} sx={{padding: '4px'}}>
                        <MovieInList key={movie.id} movie={movie} isFavoriteMode={isFavoriteMode} />
                    </Grid>
                )}
            </Grid>
     )
}

export default MovieList