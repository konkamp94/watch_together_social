import { Box } from "@mui/material"
import useSearchMovieByTitle from "../../hooks/api/useSearchMovieByTitle"
import SearchInput from "../../components/search-input/SearchInput"
// import MultipleSelectDropdown from "../../components/multiple-select-dropdown/MultipleSelectDropdown"
import useMetadata from "../../hooks/context/useMetadata"
import { useCallback, useEffect } from "react"
import useScreenSize from "../../hooks/useSreenSize"
import DetailedMovieList from "../../components/movie/DetailedMovieList"
import { mapMoviesWithGenres } from "../../utils/transform"
import MovieList from "../../components/movie/MovieList"
import CustomPagination from "../../components/pagination/CustomPagination"
import DetailedMovieListSkeleton from "../../components/movie/DetailedMovieListSkeleton"
import MovieListSkeleton from "../../components/movie/MovieListSkeleton"

const FindMovies = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { genres } = useMetadata()
    const { movies, 
        IsLoadingSearchMovies, refetchSearchMovies, error, 
        currentPage, setCurrentPage, searchParams, setSearchParams } = useSearchMovieByTitle()

    useEffect(() => {
        refetchSearchMovies()
    }, [currentPage, refetchSearchMovies, searchParams])
    
    useEffect(() => window.scrollTo(0,0), [currentPage])

    const search = useCallback((searchKeyword: string) => {
        setSearchParams((searchParams) => ( { ...searchParams, keyword: searchKeyword }))
        setCurrentPage(1)
    }, [setSearchParams, setCurrentPage])

    const changePage = (page: number) => {
        setCurrentPage(page)
    }
    
    // const selectGenre = useCallback((genreIds: string[]) => {
    //     setSearchParams((searchParams) => ( { ...searchParams, genres: genreIds }))
    // }, [setSearchParams])
    
    return (
        <Box display="flex" flexDirection="column">
            
            <SearchInput placeholder="Search Movies..." 
                searchAction={search} 
                initialValue=""/>
            {/* <MultipleSelectDropdown valuesMap={genres ? genres : {}} onChangeAction={selectGenre}/> */}
                        {/* TODO create a skeleten for loading in big screens */}
            {error && <p>{error.message}</p>}
            {IsLoadingSearchMovies && (isDesktop || isTablet) 
                ? <DetailedMovieListSkeleton mockMovieCount={2}/> 
                : IsLoadingSearchMovies && (!isDesktop && !isTablet)
                    && <MovieListSkeleton mockMovieCount={4}/>
            }
            {/* Desktop View */}
            {movies && genres && (isDesktop || isTablet) && 
                <DetailedMovieList movies={mapMoviesWithGenres(movies?.data.results, genres)}/>}
            {/* Mobile View */}
            {movies && genres && (!isDesktop && !isTablet) 
                &&  <MovieList movies={movies?.data.results}/>  
            }
            {movies && genres && <CustomPagination currentPage={currentPage} count={movies?.data.total_pages} onChangePage={changePage} sx={{ margin: '16px auto 0' }}/>}
        </Box>
    )
}

export default FindMovies