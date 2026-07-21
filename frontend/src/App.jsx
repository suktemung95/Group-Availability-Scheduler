import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import OverviewPage from "./pages/dashboard/OverviewPage"
import SchedulePage from './pages/dashboard/SchedulePage'
import GroupsPage from './pages/dashboard/GroupsPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<OverviewPage /> } />
        <Route path="/dashboard/schedule" element={<SchedulePage /> } />
        <Route path="/dashboard/groups" element={<GroupsPage /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
