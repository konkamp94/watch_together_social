import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import { Box } from '@mui/material';

export default function CustomPagination({ count, onChangePage, sx }: {count: number, onChangePage: (page: number) => void, sx:object}) {
    const [page, setPage] = useState(1);
    
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      onChangePage(value)
    };
  return (
     count !== 1 ?  (
          <Box sx={{display:'flex'}}>
            <Pagination sx={sx} count={count} page={page} variant="outlined" shape="rounded" onChange={handleChange} color="secondary"/> 
          </Box>) : null
  );
}