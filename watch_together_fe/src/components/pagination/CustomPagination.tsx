import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';

export default function CustomPagination({ currentPage, count, onChangePage, sx }: {currentPage: number, count: number, onChangePage: (page: number) => void, sx:object}) {
    
    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      onChangePage(value)
    };
  return (
     count !== 1 ?  (
          <Box sx={{display:'flex'}}>
            <Pagination sx={sx} count={count} page={currentPage} variant="outlined" shape="rounded" onChange={handleChange} color="secondary"/> 
          </Box>) : null
  );
}