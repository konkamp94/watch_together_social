import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import WeekendIcon from '@mui/icons-material/Weekend';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './NavBar.css'
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/context/useNotifcations';
import NotificationSideBar from '../notifications/NotificationSideBar';
import { useAuth } from '../../hooks/context/useAuth';


export default function NavBar({ activeButtonId, setActiveButtonId }: {activeButtonId: string, setActiveButtonId: React.Dispatch<React.SetStateAction<string>> }) {
  const navigate = useNavigate();
  const { notifications, unseenNotificationsCount, onClickBellIcon } = useNotifications()
  const { user, logout } = useAuth()
  const [openNotificationSideBar, setOpenNotificationSideBar] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      sx={{ mt: 1 }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: -4, horizontal: -100
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        onLogout();
        handleMenuClose();
      }}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => { onClickBellIcon(), setOpenNotificationSideBar(!openNotificationSideBar) }}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
        >
          <Badge badgeContent={unseenNotificationsCount}                      
                 sx={{
                    "& .MuiBadge-badge": {
                      color: "#ffffff",
                      // dark red
                      backgroundColor: "#b71c1c"
                    }
                  }}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Typography sx={{ color: 'primary.main'}}>{user.username}</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, position: 'sticky', top:0, zIndex: 10 }} position="sticky">
      <AppBar position="static">
        <Toolbar >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Watch Together
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <BottomNavigation
              sx={{ backgroundColor: 'primary.main'}}
              showLabels
              onChange={(event) => {
                setActiveButtonId(event.currentTarget.id)
              }}
            >
              <BottomNavigationAction 
                id="home" 
                className={activeButtonId === 'home' ? 'active-button' : ''} 
                sx={{color: 'primary.contrastText'}}
                label="Home" 
                icon={<HomeIcon />} 
                onClick={() => navigate('/home')}/> 
              <BottomNavigationAction 
                id="watch-movies" 
                className={activeButtonId === 'watch-movies' ? 'active-button' : ''}
                sx={{color: 'primary.contrastText'}}
                label="Watch Movies" 
                icon={<WeekendIcon />}
                onClick={() => navigate('/watch-movies/create-room')} 
              />
              <BottomNavigationAction 
                id="favorite" 
                className={activeButtonId === 'favorite' ? 'active-button' : ''} 
                sx={{color: 'primary.contrastText'}}
                label="Favorites" 
                icon={<FavoriteIcon />}
                onClick={() => navigate('/favorites')}
              />
              <BottomNavigationAction 
                id="watchlist" 
                className={activeButtonId === 'watchlist' ? 'active-button' : ''} 
                sx={{color: 'primary.contrastText'}}
                label="Watchlist" 
                icon={<MovieIcon />} 
                onClick={() => navigate('/watchlist')}
              />
            </BottomNavigation>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={() => { onClickBellIcon(), setOpenNotificationSideBar(!openNotificationSideBar)}}
            >
              <Badge badgeContent={unseenNotificationsCount}   
                     sx={{
                        "& .MuiBadge-badge": {
                          color: "#ffffff",
                          // dark red
                          backgroundColor: "#b71c1c"
                        }}
              }
  >
                <NotificationsIcon/>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle /> <span style={{fontSize: '1.2rem'}}>{user.username}</span>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <NotificationSideBar notifications={notifications} open={openNotificationSideBar} setOpen={setOpenNotificationSideBar} />
    </Box>
  );
}