import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
