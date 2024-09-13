import { Box, Chip, Grid, Stack, Typography } from "@mui/material"
import StarIcon from '@mui/icons-material/Star';
import ReactPlayer from 'react-player/youtube'
import AddToListButtons from "../action-buttons/AddToListButtons";
import Divider from '@mui/material/Divider';
import moment from "moment";
import moviePhoto from '../../assets/movie-thumbnail.jpg'

const DetailedMovie = ({movieDetails}) => {

    return (<Box sx={{ backgroundColor: 'primary.main', marginBottom: '16px' }}>
                <Box sx={{display: 'flex', textAlign: "justify", padding: '16px 16px 0'}}>
                    <Grid container spacing={2} className='grid-container-custom'>
                        <Grid item className='grid-item-custom' xs={9}>
                            <Typography variant="h6" 
                                        sx={{cursor: 'pointer', color: 'primary.contrastText', lineHeight: '0.9', '&:hover': { textDecoration: 'underline'}}}>
                                            {movieDetails.title}
                            </Typography>
                            <Typography variant="subtitle2" color="primary.contrastText">
                                {movieDetails.release_date ? moment(movieDetails.release_date).format('YYYY') : null}
                            </Typography>
                        </Grid>
                        <Grid item className='grid-item-custom' xs={3}>
                            <AddToListButtons movie={movieDetails}/>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{padding: '16px', display: 'flex', maxHeight: '300px', textAlign: 'justify'}}>
                    <img style={{maxWidth: '300px', maxHeight: '300px', marginRight: '16px'}} 
                    src={movieDetails.poster_path ? `${import.meta.env.VITE_TMDB_BASE_IMAGE_URL}/w342${movieDetails.poster_path}` : moviePhoto} />
                    {   movieDetails.trailer ?
                        <ReactPlayer url={`https://www.youtube.com/watch?v=${movieDetails.trailer?.key}`} 
                                controls={true} 
                                width={'100%'}
                                height={'inherit'}
                                style={{width: '100%',  height: 'inherit' }}/> 
                        : <Typography variant="body1" sx={{color: 'primary.contrastText'}}>Sorry, we didn't find any videos for this movie</Typography>
                    }
                </Box>
                <Box style={{overflow: 'hidden', padding: '16px'}}>
                    <Grid container spacing={2} className='grid-container-custom'>
                        <Grid item className='grid-item-custom' xs={3} md={2} lg={1}>
                            <Typography variant="body2" color="primary.contrastText" style={{marginBottom: '16px'}}>
                                <StarIcon sx={{ height: '0.8em', width: '1em'}}/>
                                <span style={{fontSize: '1.2em'}}>{movieDetails.vote_average.toPrecision(2)}</span>
                            </Typography>
                        </Grid>
                        <Grid item className='grid-item-custom' xs={9} md={10} lg={11}>
                            <Typography variant="body2" color="primary.contrastText" style={{marginBottom: '16px'}}>
                                <Stack direction="row" spacing={1}>
                                    {movieDetails.genres.map((genre: {id:number, name: string}) => (
                                            <Chip key={genre.id} label={genre.name} sx={{backgroundColor: 'primary.dark', color: 'primary.contrastText'}} />
                                    ))}
                                </Stack>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body1" sx={{color: 'primary.contrastText'}}>{movieDetails.overview}</Typography>
                    <Divider component="hr" style={{margin: '8px 0'}}/>
                    <Typography variant="body1" sx={{color: 'primary.contrastText'}}>
                        <b>Directors:</b> {movieDetails.directors.map((director, index) => { 
                            return (index + 1) !== movieDetails.directors.length ? <span key={index}>{director.name+ ', '}</span> : <span key={index}>{director.name}</span>
                        })}
                    </Typography>
                    <Divider component="hr" style={{margin: '8px 0'}}/>
                    <Typography variant="body1" sx={{color: 'primary.contrastText'}}>
                        <b>Writers:</b> {movieDetails.writers.map((writer, index) => { 
                            return (index + 1) !== movieDetails.writers.length ? <span key={index}>{writer.name+ ', '}</span> : <span key={index}>{writer.name}</span>
                        })}
                    </Typography>
                    <Divider component="hr" style={{margin: '8px 0'}}/>
                    <Typography variant="body1" sx={{color: 'primary.contrastText'}}>
                        <b>Stars:</b> {movieDetails.mainActors.map((mainActor, index) => { 
                            return (index + 1) !== movieDetails.mainActors.length ? <span key={index}>{mainActor.name+ ', '}</span> : <span key={index}>{mainActor.name}</span>
                        })}
                    </Typography>
                </Box>
    </Box>)
}

export default DetailedMovie