import { useEffect } from "react"
import { useParams } from "react-router-dom"
import DetailedMovie from "../../components/movie/DetailedMovie"
import useGetMovieDetails from "../../hooks/api/useGetMovieDetails"
import useGetSimilarMovies from "../../hooks/api/useGetSimilarMovies"
import MovieListSkeleton from "../../components/movie/MovieListSkeleton"
import MovieList from "../../components/movie/MovieList"
import ContentHeader from "../../components/content-header/ContentHeader"
import DetailedMovieSkeleton from "../../components/movie/DetailedMovieSkeleton"

const Movie = () => {
    const params = useParams()
    const { movieDetails, isLoadingMovieDetails, error: errorMovieDetails } = useGetMovieDetails(params.movieId as string)
    const { similarMovies, isLoadingSimilarMovies, error: errorSimilarMovies } = useGetSimilarMovies(params.movieId as string)

    useEffect(() => {
        window.scrollTo(0,0)
    }, [params.movieId])

    return (<>
        {/* Movie Details */}
        {errorMovieDetails && <p>{errorMovieDetails.message}</p>}
        {isLoadingMovieDetails && <DetailedMovieSkeleton/>}
        { movieDetails && 
            (<DetailedMovie movieDetails={movieDetails}/>) }
        {/* Similar Movies */}
        {errorSimilarMovies && <p>{errorSimilarMovies.message}</p>}
        {isLoadingSimilarMovies && <MovieListSkeleton mockMovieCount={4}/>}
        <ContentHeader text="Similar Movies"/>
        {similarMovies && <MovieList movies={similarMovies}/>}
    </>)
}

export default Movie