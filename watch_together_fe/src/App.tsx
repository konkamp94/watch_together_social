import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login  from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './Layout'
import Feed from './components/feed/Feed';
import LoginOrSignUpRedirect from './pages/LoginOrSignUpRedirect/LoginOrSignUpRedirect'

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
              <Route path='/main-content' element={<Feed/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
