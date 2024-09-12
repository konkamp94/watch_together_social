import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search'
import { InputBase } from "@mui/material";
import { useEffect, useRef, useState} from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 1)
  },
  color: alpha(theme.palette.primary.contrastText, 1),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
color: 'inherit',
'& .MuiInputBase-input': {
  padding: theme.spacing(1, 1, 1, 0),
  // vertical padding + font size from searchIcon
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create('width'),
  width: '100%',
},
}));

const SearchInput = ({ placeholder, searchAction, backgroundColor = 'primary.main', localStorageKey = "" }: 
{ placeholder: string, searchAction: (searchKeyword: string) => void, backgroundColor?: string, localStorageKey?: string } ) => {

    const inputRef = useRef(null)
    const [storedLastSearchKeyword] = useLocalStorage(localStorageKey)
    const [value, setValue] = useState(storedLastSearchKeyword ? storedLastSearchKeyword : "")

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
          searchAction(value)
      }, 500);

      return () => clearTimeout(delayDebounceFn);

    }, [value, searchAction])
    

    return (
      <Search sx={{ backgroundColor: backgroundColor}}>
        <SearchIconWrapper>
          <SearchIcon sx={{color: 'primary.contrastText'}}/>
        </SearchIconWrapper>
        <StyledInputBase
          key="search"
          sx={{width: '100%', color: 'primary.contrastText'}}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search' }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          ref={inputRef}
        />
      </Search>
      )

}

export default SearchInput