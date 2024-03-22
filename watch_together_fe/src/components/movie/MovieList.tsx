import { Grid } from '@mui/material';
import { MovieWithAccountState } from '../../services/api.interfaces';
import MovieInList from './MovieInList';

const MovieList = ({movies} : {movies: MovieWithAccountState[]}) => {
     return (
            <Grid container spacing={2} className='grid-container-custom'>
                {
                    movies.map((movie) =>
                    <Grid key={movie.id} item className='grid-item-custom' xs={12} sm={4} md={4} lg={2} sx={{padding: '4px'}}>
                        <MovieInList key={movie.id} movie={movie} />
                    </Grid>
                )}
            </Grid>
     )
}

export default MovieList