
import './assets/css/Register.css'
import { Route, Routes } from 'react-router-dom'
import Login from './assets/components/login'
import Register from './assets/components/register'
import Layout from './assets/components/Layout'
import Home from './assets/components/Home'
import Welcome from './assets/components/Welcome'
import Products from './assets/components/Products'
import Dashboard from './assets/components/Dashboard'
import { useContext } from 'react'
import UserContext from './assets/context/UserContext'

function App() {

  //destructure role from User Context
  const {role} = useContext(UserContext);

  return (
    <>
      
      {/* Routes */}
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Welcome/>} />
          <Route path='/home' element={<Home />} />
          <Route path='register' element={<Register/>} />
          <Route path='login' element={<Login/>}/>

          <Route path='products' element={(role === 'ADMIN' || role === 'USER') ? <Products/> : <Welcome/>}/>

          <Route path='dashboard' element={(role === 'ADMIN') ? <Dashboard/> : <Welcome/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
