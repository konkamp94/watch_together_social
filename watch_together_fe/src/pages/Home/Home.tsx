import ContentHeader from '../../components/content-header/ContentHeader';
import MovieList from '../../components/movie/MovieList';
import MovieListSkeleton from '../../components/movie/MovieListSkeleton';
import useGetRandomRecommendedMovies from '../../hooks/api/useGetRandomRecommendedMovies';

const Home = () => {

    const { recommendedMoviesWithState, error, isLoading, isFetching, isRefetchingAccountStates } = useGetRandomRecommendedMovies()

    return (
        <>
            <ContentHeader text='Recommended Movies'/>
            {isLoading || (isFetching && !isRefetchingAccountStates)? <MovieListSkeleton mockMovieCount={4}/>
                : error && <p>{error.message}</p>}
            {recommendedMoviesWithState && !isLoading && (!isFetching || isRefetchingAccountStates) &&
                <MovieList movies={recommendedMoviesWithState}/>}
        </>
    )

}

export default Home;