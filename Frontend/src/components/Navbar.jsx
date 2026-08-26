import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Brain, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setOpen(false)
  }

  const guestLinks = (
    <>
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/about" className={navLinkClass}>
        About
      </NavLink>
      <NavLink to="/contact" className={navLinkClass}>
        Contact
      </NavLink>
    </>
  )

  const studentLinks = (
    <>
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/categories" className={navLinkClass}>
        Categories
      </NavLink>
      <NavLink to="/lectures" className={navLinkClass}>
        Lectures
      </NavLink>
      <NavLink to="/leaderboard" className={navLinkClass}>
        Leaderboard
      </NavLink>
      <NavLink to="/dashboard" className={navLinkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/profile" className={navLinkClass}>
        Profile
      </NavLink>
    </>
  )

  const adminLinks = (
    <NavLink to="/admin" className={navLinkClass}>
      Admin Dashboard
    </NavLink>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
            <Brain size={18} />
          </span>
          QuizMaster
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {user ? (user.role === 'admin' ? adminLinks : studentLinks) : guestLinks}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500">
                Hi, <span className="font-semibold text-gray-800">{user.name.split(' ')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 flex flex-col gap-4 animate-fade-in">
          <div onClick={() => setOpen(false)} className="flex flex-col gap-4">
            {user ? (user.role === 'admin' ? adminLinks : studentLinks) : guestLinks}
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold text-center"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
