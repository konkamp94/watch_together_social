import ContentHeader from "../../components/content-header/ContentHeader"
import useGetFavoriteMovies from "../../hooks/api/useGetFavoriteMovies"
import MovieList from "../../components/movie/MovieList"
import CustomPagination from "../../components/pagination/CustomPagination"
import DetailedMovieList from "../../components/movie/DetailedMovieList"
import useScreenSize from "../../hooks/useSreenSize"
import useMetadata from "../../hooks/context/useMetadata"
import { mapMoviesWithGenres } from "../../utils/transform"
import DetailedMovieListSkeleton from "../../components/movie/DetailedMovieListSkeleton"
import MovieListSkeleton from "../../components/movie/MovieListSkeleton"
import { useEffect } from "react"

const Favorites = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { favoriteMovies, isLoadingFavorites, error, currentPage, setCurrentPage  } = useGetFavoriteMovies()
    const { genres } = useMetadata()
    
    useEffect(() => window.scroll(0, 0), [currentPage])

    const changePage = (page: number) => {
       setCurrentPage(page)
    }

    return(
        <>  
            <ContentHeader text='Favorites'/>
            {/* TODO create a skeleten for loading in big screens */}
            {error && <p>{error.message}</p>}
            {isLoadingFavorites && (isDesktop || isTablet) 
                ? <DetailedMovieListSkeleton mockMovieCount={2}/> 
                : isLoadingFavorites && (!isDesktop && !isTablet)
                    && <MovieListSkeleton mockMovieCount={4}/>
            }
            {/* Desktop View */}
            {favoriteMovies && genres && (isDesktop || isTablet) 
                && <DetailedMovieList movies={mapMoviesWithGenres(favoriteMovies?.data.results, genres)} isFavoriteMode={true}/>}
            {/* Mobile View */}
            {favoriteMovies && genres && (!isDesktop && !isTablet) 
                && <MovieList movies={favoriteMovies?.data.results} isFavoriteMode={true}/>}
            { favoriteMovies && genres
                && <CustomPagination currentPage={currentPage} count={favoriteMovies?.data.total_pages} onChangePage={changePage} sx={{ margin: '16px auto 0' }} />
            }
        </>
    )
}

export default Favorites