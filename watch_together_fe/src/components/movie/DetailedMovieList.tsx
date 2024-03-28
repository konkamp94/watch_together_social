import { Box } from "@mui/material"
import { MovieWithGenres, MovieWithGenresAndState } from "../../services/api.interfaces"
import DetailedMovieInList from "./DetailedMovieInList"

const DetailedMovieList = ({movies, isFavoriteMode = false, isWatchlistMode = false} : {movies: MovieWithGenres[] | MovieWithGenresAndState[], isFavoriteMode?: boolean, isWatchlistMode?: boolean}) => {
    return (<Box display="flex" flexDirection="column" flexWrap="wrap">
                {movies.map(movie => <DetailedMovieInList movie={movie} isFavoriteMode={isFavoriteMode} isWatchlistMode={isWatchlistMode}/>)}
            </Box>)
}

export default DetailedMovieList