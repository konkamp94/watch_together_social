import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
export default function CustomPagination({ count, onChangePage }: {count: number, onChangePage: (page: number) => void}) {
    const [page, setPage] = useState(1);
    
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      onChangePage(value)
    };
  return (
     count !== 1 ?  
      <Pagination count={count} page={page} variant="outlined" shape="rounded" onChange={handleChange} color="secondary"/> : null
  );
}