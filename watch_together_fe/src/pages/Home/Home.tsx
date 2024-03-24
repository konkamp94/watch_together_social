import ContentHeader from '../../components/content-header/ContentHeader';
import MovieList from '../../components/movie/MovieList';
import useGetRandomRecommendedMovies from '../../hooks/api/useGetRandomRecommendedMovies';

const Home = () => {

    const { recommendedMoviesWithState, errorMessage, isLoading } = useGetRandomRecommendedMovies()

    return (
        <>
            <ContentHeader text='Recommended Movies'/>
            {isLoading ? <p>Loading...</p> : errorMessage && <p>{errorMessage as string}</p>}
            {recommendedMoviesWithState &&
                <MovieList movies={recommendedMoviesWithState} isFavoriteMode={false}/>}
        </>
    )

}

export default Home;