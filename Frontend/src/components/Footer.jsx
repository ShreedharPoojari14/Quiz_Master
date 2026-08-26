import React from 'react'
import { Link } from 'react-router-dom'
import { Brain } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#160b39] text-gray-300 mt-20">
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
              <Brain size={18} />
            </span>
            QuizMaster
          </div>
          <p className="text-sm text-gray-400">
            Test your knowledge, earn points, and win your future — one quiz at a time.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>support@quizmaster.com</li>
            <li>+91 98765-43210</li>
            <li>123, College Road, City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} QuizMaster. All rights reserved.
      </div>
    </footer>
  )
}
