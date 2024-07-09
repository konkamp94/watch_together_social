import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login  from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './Layout'
import LoginOrSignUpRedirect from './pages/LoginOrSignUpRedirect/LoginOrSignUpRedirect'
import Home from './pages/Home/Home'
import Favorites from './pages/Favorites/Favorites'
import Watchlist from './pages/Watchlist/Watchlist'
import FindFriends from './pages/FindFriends/FindFriends'
import FriendRequests from './pages/FriendRequests/FriendRequests'
import FindMovies from './pages/FindMovies/FindMovies'
import Movie from './pages/Movie/Movie'
import WatchMovies from './pages/WatchMovies/WatchMovies'
import WatchRoom from './pages/WatchRoom/WatchRoom'
import { WatchRoomContextProvider } from './context/watch-room.context'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/login-or-sign-up-action" element={<LoginOrSignUpRedirect/>}></Route>
            <Route element={<ProtectedRoute>
                              <Layout/>
                            </ProtectedRoute>}>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/watch-movies/:tab' element={<WatchMovies/>}></Route>
                <Route path='/favorites' element={<Favorites/>}></Route>
                <Route path='/watchlist' element={<Watchlist/>}></Route>
                <Route path='/find-movies' element={<FindMovies/>}></Route>
                <Route path='/find-friends' element={<FindFriends/>}></Route>
                <Route path='/friend-requests' element={<FriendRequests/>}></Route>
                <Route path='/movie/:movieId' element={<Movie/>}></Route>
                <Route path='/watch-room/:code' element={<WatchRoomContextProvider>
                                                            <WatchRoom/>
                                                          </WatchRoomContextProvider>}>
                </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
