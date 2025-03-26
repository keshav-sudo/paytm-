import React from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import MoneySend from './pages/MoneySend'
import Signup from './pages/Signup'

const App = () => {
  return (
    <>
   
    <Routes>
    <Route path= "/signup" element= {<Signup/>}/>
    <Route path ="/signin" element= {<Signin/>} />
    <Route path ="/dashboard" element= {<Dashboard/>} />
    <Route path ="/send" element= {<MoneySend/>} />
    </Routes>
    
   
    </>
  )
}

export default App