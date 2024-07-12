import { MovieWithGenres, MovieWithGenresAndState } from "../../services/api.interfaces";
import { Box, Typography, Grid, Chip, Stack} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from "react-router-dom";
import AddToListButtons from "../action-buttons/AddToListButtons";
import moviePhoto from '../../assets/movie-thumbnail.jpg'

const DetailedMovieInList = ({movie, isFavoriteMode = false, isWatchlistMode = false}: {movie: MovieWithGenres | MovieWithGenresAndState, isFavoriteMode: boolean, isWatchlistMode: boolean}) => {
    const navigate = useNavigate()
    
    return (
            <Box sx={{ backgroundColor: 'primary.main', marginTop: '16px', padding: '16px', display: 'flex', maxHeight: '300px', textAlign: 'justify'}}>
                <img style={{maxWidth: '300px', maxHeight: '300px', marginRight: '16px'}} 
                     src={movie.poster_path ? `${import.meta.env.VITE_TMDB_BASE_IMAGE_URL}/w342${movie.poster_path}` : moviePhoto} />
                <Box style={{overflow: 'hidden', width: '100%'}}>
                    <Grid container spacing={2} className='grid-container-custom'>
                        <Grid item className='grid-item-custom' xs={9} md={10} lg={11}>
                            <Typography onClick={() => navigate(`/movie/${movie.id}`)} variant="h6" 
                                        sx={{cursor: 'pointer', color: 'primary.contrastText', lineHeight: '0.9', marginBottom: '16px', '&:hover': { textDecoration: 'underline'}}}>
                                            {movie.title}
                            </Typography>
                        </Grid>
                        <Grid item className='grid-item-custom' xs={3} md={2} lg={1}>
                                <AddToListButtons movie={movie} isFavoriteMode={isFavoriteMode} isWatchlistMode={isWatchlistMode}/>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="primary.contrastText" style={{marginBottom: '16px'}}>
                        <StarIcon sx={{ height: '0.8em', width: '1em'}}/>
                        <span style={{fontSize: '1.2em'}}>{movie.vote_average.toPrecision(2)}</span>
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText" style={{marginBottom: '16px'}}>
                        <Stack direction="row" spacing={1}>
                            {movie.genres.map(genre => (
                                    <Chip key={genre.id} label={genre.name} sx={{color: 'primary.dark'}} />
                            ))}
                        </Stack>
                    </Typography>
                    <Typography variant="body1" sx={{color: 'primary.contrastText'}}>{movie.overview}</Typography>
                </Box>
            </Box>
    )
}


export default DetailedMovieInList