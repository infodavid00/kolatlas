import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './parts/Header.jsx'
import Home from './pages/Home.jsx'
import Overview from './pages/Overview.jsx'
import Notfound from './pages/Notfound.jsx'
import './index.css'

function App() {
  return (
    <>
      <Header />
      <div id='wrapper'>
        <Routes>
           <Route exact path='/' element={<Home />} />
           <Route exact path='/overview/:id' element={<Overview />} />
           <Route exact path='*' element={<Notfound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
