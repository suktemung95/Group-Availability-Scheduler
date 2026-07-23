import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import OverviewPage from "./pages/dashboard/OverviewPage"
import SchedulePage from './pages/dashboard/SchedulePage'
import GroupsPage from './pages/dashboard/GroupsPage'
import InvitesPage from './pages/dashboard/InvitesPage'
import OverlapsPage from './pages/dashboard/OverlapsPage'
import SignupPage from './pages/SignupPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<OverviewPage /> } />
        <Route path="/dashboard/schedule" element={<SchedulePage /> } />
        <Route path="/dashboard/groups" element={<GroupsPage /> } />
        <Route path="/dashboard/invites" element={<InvitesPage /> } />
        <Route path="/dashboard/overlap" element={<OverlapsPage /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
