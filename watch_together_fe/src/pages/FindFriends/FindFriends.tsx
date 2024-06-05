import { Box } from "@mui/material"
import OtherUserList from "../../components/other-user/OtherUserList"
import SearchInput from "../../components/search-input/SearchInput"
import useSearchOtherUsersByUsernameOrName from "../../hooks/api/useSearchFriendByUsernameOrName"
import useScreenSize from "../../hooks/useSreenSize"

const FindFriends = () => {
    const { isDesktop, isTablet } = useScreenSize()
    const { otherUsers, 
            isLoadingOtherUsers, 
            error, 
            searchKeyword,
            setSearchKeyword } = useSearchOtherUsersByUsernameOrName()

    const search = (searchKeyword: string) => {
        setSearchKeyword(searchKeyword)
    } 

    return (
        <>
            <Box sx={{padding: isDesktop ? '0 192px' : isTablet ? '0 64px' : 0}}>
            <SearchInput placeholder="Type your Friend's Username or Name" 
                            searchAction={search} 
                            initialValue={searchKeyword}/>
                {isLoadingOtherUsers ? <p>Loading...</p> : null}
                {error && <p>{error.message}</p>}
                {!isLoadingOtherUsers && otherUsers &&<OtherUserList otherUsers={otherUsers.data}/>}
            </Box>
        </>
    )
}

export default FindFriends