import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login  from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './Layout'
import LoginOrSignUpRedirect from './pages/LoginOrSignUpRedirect/LoginOrSignUpRedirect'
import Home from './pages/Home/Home'

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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
