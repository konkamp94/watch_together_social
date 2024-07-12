import { Grid, Skeleton } from "@mui/material"
const DetailedMovieListSkeleton = ({ mockMovieCount = 4 }: {mockMovieCount: number} ) => {

    const generateMockMoviesItems = () => {
        const mockMoviesItems = [];
        for (let i = 0; i < mockMovieCount; i++) {
            mockMoviesItems.push(
                (   <Grid key={i} container>
                        <Grid item className='grid-item-custom' xs={3} sx={{padding: '4px'}}>
                            <Skeleton variant="rectangular" height={300}/>
                        </Grid>
                        <Grid item className='grid-item-custom' xs={9} sx={{padding: '4px'}}>
                                    <Skeleton variant="rectangular" height={38} sx={{marginBottom: '12px'}}/>
                                    <Skeleton variant="rectangular" height={250}/>
                        </Grid>
                     </Grid>
                )
            )
        }
        
        return mockMoviesItems
    }

    return (
        <Grid container spacing={2} className='grid-container-custom' sx={{paddingTop: '4px'}}>
            { generateMockMoviesItems().map((mockMovieItem) => mockMovieItem) }
        </Grid>
    )
}

export default DetailedMovieListSkeleton