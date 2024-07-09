import { Box, Chip } from "@mui/material"
import SearchInput from "../../../search-input/SearchInput"
import useSearchMovieByTitle from "../../../../hooks/api/useSearchMovieByTitle"
import useMetadata from "../../../../hooks/context/useMetadata"
import { useCallback, useEffect } from "react"
import CustomPagination from "../../../pagination/CustomPagination"
import MovieListSkeleton from "../../../movie/MovieListSkeleton"
import MovieListForm from "./MovieListForm"

const MovieSelectionStep = ({ selectedMovieId, selectedMovieTitle, formAction }: {selectedMovieId: number | undefined,selectedMovieTitle: string | undefined, formAction?: (movieInfo: {movieId: number, movieTitle: string}) => void }) => {
    const { genres } = useMetadata()

    const { movies, 
        IsLoadingSearchMovies, refetchSearchMovies, error, 
        currentPage, setCurrentPage, searchParams, setSearchParams } = useSearchMovieByTitle()

    useEffect(() => {
        refetchSearchMovies()
    }, [currentPage, refetchSearchMovies, searchParams])
    
    useEffect(() => window.scrollTo(0,0), [currentPage])

    const search = useCallback((searchKeyword: string) => {
        window.localStorage.setItem('lastSearchKeywordMovieSelection', searchKeyword)
        setSearchParams((searchParams) => ( { ...searchParams, keyword: searchKeyword }))
        setCurrentPage(1)
    }, [setSearchParams, setCurrentPage])

    const changePage = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <Box display="flex" flexDirection="column">
            {
                selectedMovieId && selectedMovieTitle ?
                <Chip key={selectedMovieId} 
                      label={<><b>Selected Movie: </b>{selectedMovieTitle}</>} 
                      sx={{color: 'primary.contrastText', marginBottom: '8px', fontSize: '16px'}} /> 
                : <Chip key={selectedMovieId} 
                label={<b>No movie selected</b>} 
                sx={{color: 'primary.contrastText', marginBottom: '8px', fontSize: '16px'}} /> 
            }
            <SearchInput placeholder="Search Movie" 
                searchAction={search}
                localStorageKey="lastSearchKeywordMovieSelection"
                backgroundColor="primary.dark"/>
            
            {error && <p>{error.message}</p>}
            {IsLoadingSearchMovies && <MovieListSkeleton mockMovieCount={4}/>}
            {movies && genres  &&  <MovieListForm movies={movies?.data.results} selectedMovieId={selectedMovieId} formAction={formAction}/>  }
            {movies && genres && <CustomPagination currentPage={currentPage} count={movies?.data.total_pages} onChangePage={changePage} sx={{ margin: '16px auto 0' }}/>}
        </Box>
    )
}

export default MovieSelectionStep