import React from 'react'
import { Routes, Route } from "react-router-dom";
import Main from './Main/Main'
import Leader from './leaderboard/Leader';
import Map from './Map/Map';
import Issue from './Issue/Issue';
import Signup from './signup/SignupPage';
import Login from './components/Login';
import ReportIssue from './report_issue/report_issue';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main/>} />
      <Route path="/leaderboard" element={<Leader/>} />
      <Route path="/Map" element={<Map/>}/>
      <Route path="/Issue" element={<Issue/>} />
      <Route path="/Signup" element={<Signup/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path = "/ReportIssue" element = {<ReportIssue/>}/>
    </Routes>
  )
}
 
export default App
