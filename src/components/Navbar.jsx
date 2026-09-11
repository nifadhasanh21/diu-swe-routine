import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 p-[1px] shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors" />
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8m-8 4h12" />
              </svg>
            </div>
          </div>
          <div>
            <span className="font-black text-base tracking-tight block leading-none text-white group-hover:text-teal-400 transition-colors">
              DIU <span className="text-teal-400">SWE</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mt-1">
              Routine Portal
            </span>
          </div>
        </Link>

        {/* Public Navigation Links (Admin Hidden) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/')
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          <Link
            to="/about"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('/about')
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
        </nav>

      </div>
    </header>
  );
}