import ContentHeader from "../../components/content-header/ContentHeader"
import useGetWatchlistMovies from "../../hooks/api/useGetWatchlistMovies"
import MovieList from "../../components/movie/MovieList"
import CustomPagination from "../../components/pagination/CustomPagination"
import DetailedMovieList from "../../components/movie/DetailedMovieList"
import useScreenSize from "../../hooks/useSreenSize"
import useMetadata from "../../hooks/context/useMetadata"
import { mapMoviesWithGenres } from "../../utils/transform"
import DetailedMovieListSkeleton from "../../components/movie/DetailedMovieListSkeleton"
import MovieListSkeleton from "../../components/movie/MovieListSkeleton"
import { useEffect } from "react"
import { Typography } from "@mui/material"

const Watchlist = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { watchlistMovies, isLoadingWatchlist, error, currentPage, setCurrentPage  } = useGetWatchlistMovies()
    const { genres } = useMetadata()
    
    useEffect(() => window.scroll(0, 0), [currentPage])

    const changePage = (page: number) => {
       setCurrentPage(page)
    }

    return(
        <>  
            <ContentHeader text='Watchlist'/>
            {/* TODO create a skeleten for loading in big screens */}
            {error && <p>{error.message}</p>}
            {isLoadingWatchlist && (isDesktop || isTablet) 
                ? <DetailedMovieListSkeleton mockMovieCount={2}/> 
                : isLoadingWatchlist && (!isDesktop && !isTablet)
                    && <MovieListSkeleton mockMovieCount={4}/>
            }
            {/* Desktop View */}
            {watchlistMovies && genres && (isDesktop || isTablet) && 
                <DetailedMovieList movies={mapMoviesWithGenres(watchlistMovies?.data.results, genres)} isWatchlistMode={true}/>}
            {/* Mobile View */}
            {watchlistMovies && genres && (!isDesktop && !isTablet) 
                && <MovieList movies={watchlistMovies?.data.results} isWatchlistMode={true}/>}
             {!isLoadingWatchlist && watchlistMovies?.data.results.length === 0 && <Typography sx={{ color: 'primary.contrastText', mt: 2, fontSize: 'larger' }}>There is no movies in the watchlist yet! Search and save movies to watchlist to watch them later!</Typography>}
            {watchlistMovies && watchlistMovies?.data.results.length !== 0 && genres 
                && <CustomPagination currentPage={currentPage} count={watchlistMovies?.data.total_pages} onChangePage={changePage} sx={{ margin: '16px auto 0' }}/>
            }
        </>
    )
}

export default Watchlist