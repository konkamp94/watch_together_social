import { MovieWithGenres, MovieWithGenresAndState } from "../../services/api.interfaces";
import { Box, IconButton, Typography, Grid, CircularProgress, Chip, Stack} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import useAddOrRemoveFavorite from "../../hooks/api/useAddToFavorite";
import { useState } from "react";
import useAddOrRemoveWatchlist from "../../hooks/api/useAddToWatchlist";
import { MovieCreation } from "@mui/icons-material";

const DetailedMovieInList = ({movie, isFavoriteMode = false, isWatchlistMode = false}: {movie: MovieWithGenres | MovieWithGenresAndState, isFavoriteMode: boolean, isWatchlistMode: boolean}) => {

    const [isFavorite, setIsFavorite] = useState(() => {
        if(isFavoriteMode) { return true }
        if('state' in movie) { 
          return movie.state.favorite 
        }
      });
    const { addOrRemoveFavorite, isLoading: isLoadingFavorite } = useAddOrRemoveFavorite(() =>  { 
        setIsFavorite(!isFavorite) 
    });

    const [isWatchlist, setIsWatchlist] = useState(() => {
    if(isWatchlistMode) { return true }
    if('state' in movie) { 
        return movie.state.watchlist 
    }
    });

    const { addOrRemoveWatchlist, isLoading: isLoadingWatchlist } = useAddOrRemoveWatchlist(() =>  { 
        setIsWatchlist(!isWatchlist) 
    });
    
    return (
            <Box sx={{ backgroundColor: 'primary.light', marginTop: '16px', padding: '16px', display: 'flex', maxHeight: '300px', textAlign: 'justify'}}>
                <img style={{maxWidth: '300px', maxHeight: '300px', marginRight: '16px'}} src={`${import.meta.env.VITE_TMDB_BASE_IMAGE_URL}/w300${movie.poster_path}`} />
                <Box style={{overflow: 'hidden'}}>
                    <Grid container spacing={2} className='grid-container-custom'>
                        <Grid className='grid-item-custom' xs={9} md={10} lg={11}>
                            <Typography variant="h6" sx={{color: 'primary.contrastText', lineHeight: '0.9', marginBottom: '16px'}}>{movie.title}</Typography>
                        </Grid>
                        <Grid className='grid-item-custom' xs={3} md={2} lg={1}>
                            {!isWatchlistMode ?
                                <IconButton aria-label="add to favorites" 
                                    sx={{padding: 0, float: 'right'}}
                                    onClick={() => { addOrRemoveFavorite({movieId: movie.id, isFavorite: !isFavorite}) }}>
                                    {!isLoadingFavorite ?
                                        <FavoriteIcon 
                                        sx={isFavorite ? {color: 'secondary.light' } : null}/> :
                                        <CircularProgress size={30}/>
                                    }
                                </IconButton>
                            : null}
                            {!isFavoriteMode ? 
                                <IconButton aria-label="add to watchlist" 
                                    sx={{padding: 0, float: 'right'}}
                                    onClick={() => { addOrRemoveWatchlist({movieId: movie.id, isWatchlist: !isWatchlist}) }}>
                                    {!isLoadingWatchlist ?
                                        <MovieCreation 
                                        sx={isWatchlist ? {color: 'secondary.light' } : null}/> :
                                        <CircularProgress size={30}/>
                                    }
                                </IconButton>
                            : null}
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="primary.contrastText" style={{marginBottom: '16px'}}>
                        <StarIcon sx={{ height: '0.8em', width: '1em'}}/>
                        <span style={{fontSize: '1.2em'}}>{movie.vote_average.toPrecision(2)}</span>
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText" style={{marginBottom: '16px'}}>
                        <Stack direction="row" spacing={1}>
                            {movie.genres.map(genre => (
                                    <Chip key={genre.id} label={genre.name} color="primary" />
                            ))}
                        </Stack>
                    </Typography>
                    <Typography variant="body1" sx={{color: 'primary.contrastText'}}>{movie.overview}</Typography>
                </Box>
            </Box>
    )
}


export default DetailedMovieInList