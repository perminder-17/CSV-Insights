import { Link } from 'react-router-dom'
import { FileJson, List, Heart } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors">
          <FileJson className="w-6 h-6" />
          CSV Insights
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Upload
          </Link>
          <Link
            to="/reports"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Reports
          </Link>
          <Link
            to="/status"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <Heart className="w-4 h-4" />
            Status
          </Link>
        </div>
      </div>
    </nav>
  )
}
