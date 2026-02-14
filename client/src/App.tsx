import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { FileText, BarChart3, Activity } from 'lucide-react'
import Home from './pages/Home'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
import Status from './pages/Status'

function NavBar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="border-b border-slate-800 bg-slate-950 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
          <FileText size={24} />
          CSV Insights
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-blue-500 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText size={18} />
            Upload
          </Link>
          
          <Link
            to="/reports"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive('/reports')
                ? 'bg-blue-500 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={18} />
            Reports
          </Link>
          
          <Link
            to="/status"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/status'
                ? 'bg-blue-500 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity size={18} />
            Status
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <NavBar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
