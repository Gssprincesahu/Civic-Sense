import React from 'react'
import { Routes, Route } from "react-router-dom";
import Main from './Main/Main'
import Leader from './leaderboard/Leader';
import Map from './Map/Map';
import Issue from './components/IssuePage';
import Signup from './components/Signup';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main/>} />
      <Route path="/leaderboard" element={<Leader/>} />
      <Route path="/Map" element={<Map/>}/>
      <Route path="/Issue" element={<Issue/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
  )
}
 
export default App
