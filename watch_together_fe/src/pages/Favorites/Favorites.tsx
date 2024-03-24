import ContentHeader from "../../components/content-header/ContentHeader"
import useGetFavoriteMovies from "../../hooks/api/useGetFavoriteMovies"
import MovieList from "../../components/movie/MovieList"
import CustomPagination from "../../components/pagination/CustomPagination"

const Favorites = () => {

    const { favoriteMovies, isLoadingFavorites, errorMessage, setCurrentPage  } = useGetFavoriteMovies()

    const changePage = (page: number) => {
       setCurrentPage(page)
    }
    return(
        <>
            <ContentHeader text='Favorite Movies'/>
            {isLoadingFavorites ? <p>Loading...</p> : errorMessage && <p>{errorMessage as string}</p>}
            {favoriteMovies && <MovieList movies={favoriteMovies?.data.results} isFavoriteMode={true}/>}
            <CustomPagination count={favoriteMovies?.data.total_pages} onChangePage={changePage}
                sx={{ marginTop: '16px' }}
            />
        </>
    )
}

export default Favorites