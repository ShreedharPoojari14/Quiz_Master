import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute.jsx'
import AdminLayout from './components/AdminLayout.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Categories from './pages/Categories.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import AllResults from './pages/AllResults.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Profile from './pages/Profile.jsx'
import Lectures from './pages/Lectures.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminQuestions from './pages/admin/AdminQuestions.jsx'
import AddQuestion from './pages/admin/AddQuestion.jsx'
import AdminResults from './pages/admin/AdminResults.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminLectures from './pages/admin/AdminLectures.jsx'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Guest-only auth pages */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Authenticated student pages */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Categories />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:categoryId"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Quiz />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Result />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <StudentDashboard />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <AllResults />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Leaderboard />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lectures"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Lectures />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <Profile />
            </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin pages */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="questions/new" element={<AddQuestion />} />
        <Route path="questions/:id/edit" element={<AddQuestion />} />
        <Route path="lectures" element={<AdminLectures />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />
    </Routes>
  )
}
