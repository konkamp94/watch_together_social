import { MovieWithAccountState } from "../../services/api.interfaces";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Star';
import moment from "moment";
import useAddOrRemoveFavorite from "../../hooks/api/useAddToFavorite";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

const MovieInList = ({movie}: {movie: MovieWithAccountState}) => {
    // assume it's not favorite by default, this should be fetched from the backend
    const [isFavorite, setIsFavorite] = useState(movie.state.favorite);
    const { addOrRemoveFavorite, isLoading } = useAddOrRemoveFavorite(() => setIsFavorite(!isFavorite));

    const titleSpan = <span style={{position: 'absolute', top: 0, padding: '8px', left: 0, fontSize: '1rem'}}>{movie.title}</span>

    return (
      <Card sx={{ maxWidth: '100%', backgroundColor: 'primary.light', minHeight: '100%'}} elevation={5}>
        <CardMedia
          component="img"
          height="100%"
          image={`${import.meta.env.VITE_TMDB_BASE_IMAGE_URL}/w300${movie.poster_path}`}
          alt="movie image"
        />
        <CardHeader
          title={titleSpan}
          sx={{padding: '0 8px', height: '3rem', marginTop: '8px', position: 'relative', overflow: 'hidden'}}
        >
        </CardHeader>
        <CardContent sx={{paddingTop: 0, padding: '8px'}}>
          <Grid container>
            <Grid item xs={12}>
                <Typography variant="body2" color="primary.contrastText">
                <StarIcon sx={{ height: '0.8em', width: '1em' }}/>
                <span style={{fontSize: '1.2em'}}>{movie.vote_average.toPrecision(2)}</span>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary.contrastText">
                    <b>Year:</b> {moment(movie.release_date).format('YYYY')}
                </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={() => { addOrRemoveFavorite({movieId: movie.id, isFavorite}) }}>
            {!isLoading ?
            <FavoriteIcon 
               sx={isFavorite ? {color: 'secondary.light' } : null}/> :
               <CircularProgress size={30}/>
            }
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
}

export default MovieInList;