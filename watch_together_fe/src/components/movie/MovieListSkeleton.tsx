import { Grid, Skeleton } from "@mui/material"
const MovieListSkeleton = ({ mockMovieCount = 4 }: {mockMovieCount: number} ) => {

    const generateMockMoviesItems = () => {
        const mockMoviesItems = [];
        for (let i = 0; i < mockMovieCount; i++) {
            mockMoviesItems.push(
                (
                    <Grid item key={i} className='grid-item-custom' xs={12} sm={6} md={3} lg={3} sx={{padding: '4px'}}>
                        <Skeleton variant="rectangular" height={400}/>
                     </Grid>
                )
            )
        }
        
        return mockMoviesItems
    }

    return (
        <Grid container spacing={2} className='grid-container-custom'>
            { generateMockMoviesItems().map((mockMovieItem) => mockMovieItem) }
        </Grid>
    )
}

export default MovieListSkeleton