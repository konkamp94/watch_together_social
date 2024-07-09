import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Star';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import moviePhoto from '../../../../assets/movie-thumbnail.jpg'
import { MovieWithGenres, MovieWithGenresAndState } from '../../../../services/api.interfaces';

const MovieInListForm = ({movie, isSelectedMovie, formAction = () => {}}: {movie: MovieWithGenres | MovieWithGenresAndState, isSelectedMovie: boolean, formAction?: (movieInfo: {movieId: number, movieTitle: string}) => void}) => {
  const navigate = useNavigate()  

  const titleSpan = <span onClick={() => navigate(`/movie/${movie.id}`)} 
                          className="link-hover"
                          style={{ cursor: 'pointer', position: 'absolute', top: 0, padding: '8px', left: 0, fontSize: '1rem' }}>
                            {movie.title}
                    </span>

    return (
      <Card sx={{ maxWidth: '100%', backgroundColor: !isSelectedMovie ? 'primary.main' : 'primary.dark', minHeight: '100%', cursor: 'pointer'}} elevation={5} 
            onClick={() => { formAction({movieId: movie.id, movieTitle: movie.title}) }}>
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
      </Card>
    );
}

export default MovieInListForm;