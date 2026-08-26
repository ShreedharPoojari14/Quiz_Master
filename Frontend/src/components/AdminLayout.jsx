import React, { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  HelpCircle,
  PlusCircle,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  BookOpen,
  Brain,
  UserCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { to: '/admin/questions/new', label: 'Add Question', icon: PlusCircle },
  { to: '/admin/lectures', label: 'Lectures', icon: BookOpen },
  { to: '/admin/results', label: 'Results', icon: BarChart3 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 flex items-center gap-2 font-bold text-white text-lg border-b border-white/10">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
          <Brain size={18} />
        </span>
        QuizMaster
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:block w-64 bg-[#160b39] shrink-0">{sidebarContent}</aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#160b39]">{sidebarContent}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <span className="hidden sm:inline">Signed in as</span>
            <span className="font-semibold text-gray-800">{user?.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">Admin</span>
          </div>
        </header>
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
