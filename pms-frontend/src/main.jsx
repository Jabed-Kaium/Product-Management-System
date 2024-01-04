import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './assets/components/Navbar.jsx'
import { IsLoggedProvider } from './assets/context/IsLoggedContext.jsx'
import { UserContextProvider } from './assets/context/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <IsLoggedProvider>
        <UserContextProvider>
          <Navbar/>
          <Routes>
            <Route path='/*' element={<App/>}/>
          </Routes>
        </UserContextProvider>
      </IsLoggedProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
