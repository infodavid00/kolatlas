import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './parts/Header.jsx'
import Home from './pages/Home.jsx'
import Overview from './pages/Overview.jsx'
import Tokens from './pages/Tokens.jsx'
import Details from './pages/Details.jsx'
import Calls from './pages/Calls.jsx'
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
           <Route exact path='/tokens' element={<Tokens />} />
           <Route exact path='/details/:id' element={<Details />} />
           <Route exact path='/calls' element={<Calls />} />
           <Route exact path='*' element={<Notfound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
