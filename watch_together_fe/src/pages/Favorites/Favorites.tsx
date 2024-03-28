import ContentHeader from "../../components/content-header/ContentHeader"
import useGetFavoriteMovies from "../../hooks/api/useGetFavoriteMovies"
import MovieList from "../../components/movie/MovieList"
import CustomPagination from "../../components/pagination/CustomPagination"
import DetailedMovieList from "../../components/movie/DetailedMovieList"
import useScreenSize from "../../hooks/useSreenSize"
import useMetadata from "../../hooks/context/useMetadata"
import { mapMoviesWithGenres } from "../../utils/transform"

const Favorites = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { favoriteMovies, isLoadingFavorites, errorMessage, setCurrentPage  } = useGetFavoriteMovies()
    const { genres } = useMetadata()

    const changePage = (page: number) => {
       setCurrentPage(page)
    }

    return(
        <>  
            <ContentHeader text='Favorites'/>
            {/* TODO create a skeleten for loading in big screens */}
            {isLoadingFavorites ? <p>Loading...</p> : errorMessage && <p>{errorMessage as string}</p>}
            {/* Desktop View */}
            {favoriteMovies && genres && (isDesktop || isTablet) && 
                <DetailedMovieList movies={mapMoviesWithGenres(favoriteMovies?.data.results, genres)} isFavoriteMode={true}/>}
            {/* Mobile View */}
            {favoriteMovies && genres && (!isDesktop && !isTablet) 
                && <MovieList movies={favoriteMovies?.data.results} isFavoriteMode={true}/>}
            <CustomPagination count={favoriteMovies?.data.total_pages} onChangePage={changePage}
                sx={{ margin: '16px auto 0' }}
            />
        </>
    )
}

export default Favorites