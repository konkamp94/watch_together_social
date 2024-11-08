import { MovieWithGenres, MovieWithGenresAndState } from "../../services/api.interfaces";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Star';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import moviePhoto from '../../assets/movie-thumbnail.jpg'
import AddToListButtons from "../action-buttons/AddToListButtons";

const MovieInList = ({movie, isFavoriteMode = false, isWatchlistMode = false}: {movie: MovieWithGenres | MovieWithGenresAndState, isFavoriteMode: boolean, isWatchlistMode: boolean}) => {
  const navigate = useNavigate()  

  const titleSpan = <span onClick={() => navigate(`/movie/${movie.id}`)} 
                          className="link-hover"
                          style={{ cursor: 'pointer', position: 'absolute', top: 0, padding: '8px', left: 0, fontSize: '1rem' }}>
                            {movie.title}
                    </span>

    return (
      <Card sx={{ maxWidth: '100%', backgroundColor: 'primary.main', minHeight: '100%'}} elevation={5}>
        <CardMedia
          component="img"
          sx={{height:'300px'}}
          image={movie.poster_path ? `${import.meta.env.VITE_TMDB_BASE_IMAGE_URL}/w342${movie.poster_path}` : moviePhoto}
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
            <AddToListButtons movie={movie} isFavoriteMode={isFavoriteMode} isWatchlistMode={isWatchlistMode}/>
        </CardActions>
      </Card>
    );
}

export default MovieInList;