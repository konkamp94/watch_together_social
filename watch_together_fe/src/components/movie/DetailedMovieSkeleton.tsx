import { Grid, Skeleton } from "@mui/material"

const DetailedMovieSkeleton = () => {
 return (
    <>
    <Grid container spacing={2} className='grid-container-custom'>
        <Grid item className='grid-item-custom' xs={12} sx={{paddingBottom: '4px'}}>
            <Skeleton variant="rectangular" height={38}/>
        </Grid>
        <Grid item className='grid-item-custom' xs={3} sx={{paddingRight: '4px'}}>
            <Skeleton variant="rectangular" height={300}/>
        </Grid>
        <Grid item className='grid-item-custom' xs={9}>
            <Skeleton variant="rectangular" height={300}/>
        </Grid>
    </Grid>
    </>
 )
}

export default DetailedMovieSkeleton