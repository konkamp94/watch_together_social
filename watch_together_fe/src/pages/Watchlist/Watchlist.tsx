import ContentHeader from "../../components/content-header/ContentHeader"
import useGetWatchlistMovies from "../../hooks/api/useGetWatchlistMovies"
import MovieList from "../../components/movie/MovieList"
import CustomPagination from "../../components/pagination/CustomPagination"
import DetailedMovieList from "../../components/movie/DetailedMovieList"
import useScreenSize from "../../hooks/useSreenSize"
import useMetadata from "../../hooks/context/useMetadata"
import { mapMoviesWithGenres } from "../../utils/transform"

const Watchlist = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { watchlistMovies, isLoadingWatchlist, errorMessage, setCurrentPage  } = useGetWatchlistMovies()
    const { genres } = useMetadata()

    const changePage = (page: number) => {
       setCurrentPage(page)
    }

    return(
        <>  
            <ContentHeader text='Watchlist'/>
            {/* TODO create a skeleten for loading in big screens */}
            {isLoadingWatchlist ? <p>Loading...</p> : errorMessage && <p>{errorMessage as string}</p>}
            {/* Desktop View */}
            {watchlistMovies && genres && (isDesktop || isTablet) && 
                <DetailedMovieList movies={mapMoviesWithGenres(watchlistMovies?.data.results, genres)} isWatchlistMode={true}/>}
            {/* Mobile View */}
            {watchlistMovies && genres && (!isDesktop && !isTablet) 
                && <MovieList movies={watchlistMovies?.data.results} isWatchlistMode={true}/>}
            <CustomPagination count={watchlistMovies?.data.total_pages} onChangePage={changePage}
                sx={{ margin: '16px auto 0' }}
            />
        </>
    )
}

export default Watchlist