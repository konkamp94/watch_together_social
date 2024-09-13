import { CircularProgress, IconButton } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import useAddOrRemoveFavorite from "../../hooks/api/useAddToFavorite";
import useAddOrRemoveWatchlist from "../../hooks/api/useAddToWatchlist";
import { MovieCreation } from "@mui/icons-material";

const AddToListButtons = ({ movie, isFavoriteMode = false, isWatchlistMode = false }) => {
    const [isFavorite, setIsFavorite] = useState(() => {
        if(isFavoriteMode) { return true }
        // if('state' in movie) { 
        //   return movie.state.favorite 
        // }
        return movie?.state?.favorite ?? false;
      });
    const { addOrRemoveFavorite, isLoading: isLoadingFavorite } = useAddOrRemoveFavorite(() =>  { 
        setIsFavorite(!isFavorite) 
    });

    const [isWatchlist, setIsWatchlist] = useState(() => {
        if(isWatchlistMode) { return true }
        // if('state' in movie) { 
        //     return movie.state.watchlist 
        // }
        return movie?.state?.wathlist ?? false;
    });
    
    const { addOrRemoveWatchlist, isLoading: isLoadingWatchlist } = useAddOrRemoveWatchlist(() =>  { 
        setIsWatchlist(!isWatchlist) 
    });

    useEffect(() => {
        setIsFavorite(() => {
          if(isFavoriteMode) { return true }
          return movie?.state?.favorite ?? false;
        })
        setIsWatchlist(() => {
          if(isWatchlistMode) { return true }
          return movie?.state?.wathlist ?? false;
        })
      }, [movie, isFavoriteMode, isWatchlistMode])

    return (<>
            {!isWatchlistMode ?
                <IconButton aria-label="add to favorites" 
                    sx={{padding: 0, float: 'right'}}
                    onClick={() => { addOrRemoveFavorite({movieId: movie.id, isFavorite: !isFavorite}) }}>
                    {!isLoadingFavorite ?
                        <FavoriteIcon 
                        sx={isFavorite ? {color: 'primary.contrastText' } : null}/> :
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
                        sx={isWatchlist ? {color: 'primary.contrastText' } : null}/> :
                        <CircularProgress size={30}/>
                    }
                </IconButton>
            : null}
    </>)
}

export default AddToListButtons