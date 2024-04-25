import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login  from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './Layout'
import LoginOrSignUpRedirect from './pages/LoginOrSignUpRedirect/LoginOrSignUpRedirect'
import Home from './pages/Home/Home'
import Favorites from './pages/Favorites/Favorites'
import useMetadata from './hooks/context/useMetadata'
import Watchlist from './pages/Watchlist/Watchlist'
import FindFriends from './pages/FindFriends/FindFriends'
import FriendRequests from './pages/FriendRequests/FriendRequests'
import FindMovies from './pages/FindMovies/FindMovies'

function App() {
  const { genres } = useMetadata()

  return (
    <>
      {/*Wait for genres metadata to load the app  */}
      {genres ? 
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/login-or-sign-up-action" element={<LoginOrSignUpRedirect/>}></Route>
          <Route element={<ProtectedRoute>
                            <Layout/>
                          </ProtectedRoute>}>
              <Route path='/home' element={<Home />}></Route>
              <Route path='/favorites' element={<Favorites/>}></Route>
              <Route path='/watchlist' element={<Watchlist/>}></Route>
              <Route path='/find-movies' element={<FindMovies/>}></Route>
              <Route path='/find-friends' element={<FindFriends/>}></Route>
              <Route path='/friend-requests' element={<FriendRequests/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      : null}
    </>
  )
}

export default App
