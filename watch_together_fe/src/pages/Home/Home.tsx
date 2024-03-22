import { useState, useEffect } from 'react';
import ContentHeader from '../../components/content-header/ContentHeader';
import MovieList from '../../components/movie/MovieList';
import useRecommendedMovies from '../../hooks/api/useRecommendedMovies';
import { Movie } from '../../services/api.interfaces';

const Home = () => {

    const { recommendedMovies, recommendedMoviesStates, errorMessage, isLoading } = useRecommendedMovies()
    const [randomRecommendedMovies,setRandomRecommendedMovies] = useState([])

    useEffect(() => {
        if(recommendedMovies){
            const sixRandomRecommendedMovies = recommendedMovies?.data.results
            .sort(() => 0.5 - Math.random())
            .slice(0, 6)

            setRandomRecommendedMovies(sixRandomRecommendedMovies)
        }
    }, [recommendedMovies])

    return (
        <>
            <ContentHeader text='Recommended Movies'/>
            {isLoading ? <p>Loading...</p> : errorMessage && <p>{errorMessage as string}</p>}
            {recommendedMovies && recommendedMoviesStates &&
                <MovieList movies={
                    // returns a list of 6 recommended movies from the recommendedMovies response randomly
                    randomRecommendedMovies.map((randomRecommendedMovie: Movie) => (
                        {  
                            ...randomRecommendedMovie, 
                            state: recommendedMoviesStates
                                   .map((recommendedMovieState) => recommendedMovieState.data)
                                   .find(recommendedMovieState => {
                                     return recommendedMovieState.id === randomRecommendedMovie.id
                                }) 
                        }))
                } />}
        </>
    )

}

export default Home;