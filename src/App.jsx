import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Home/>
    
    </>
  )
}

export default App
