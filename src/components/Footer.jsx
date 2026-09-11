import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs font-sans no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Section 1: About Portal */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <h4 className="font-bold text-slate-200 text-sm tracking-wide">
                About The Portal
              </h4>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              DIU SWE Routine Portal provides rapid, accessible, and high-definition timetable lookup for students and faculty members across all batches and sections.
            </p>
          </div>

          {/* Section 2: Developer & Premium Social Links */}
          <div className="space-y-4 md:justify-self-end">
            <div>
              <h4 className="font-bold text-teal-400 text-[11px] tracking-wider uppercase">
                Developed By
              </h4>
              <p className="text-slate-100 font-bold text-base mt-0.5">
                <a 
                  href="https://nifadhasan.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-100 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 group"
                >
                  Nifad Hasan Eimu
                  <svg 
                    className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <span className="text-[11px] font-medium text-slate-400 block">Connect & Follow</span>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
<a
  href="https://facebook.com/nifadhasanh21"
  target="_blank"
  rel="noopener noreferrer"
  className="group relative p-2.5 bg-slate-800/80 hover:bg-teal-500 text-slate-300 hover:text-slate-950 rounded-xl transition-all duration-300 border border-slate-700/60 hover:border-teal-400 shadow-lg hover:shadow-teal-500/25 active:scale-95"
  aria-label="Facebook"
>
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
    Facebook
  </span>
</a>

                {/* GitHub */}
                <a
                  href="https://github.com/nifadhasanh21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 bg-slate-800/80 hover:bg-teal-500 text-slate-300 hover:text-slate-950 rounded-xl transition-all duration-300 border border-slate-700/60 hover:border-teal-400 shadow-lg hover:shadow-teal-500/25 active:scale-95"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                    GitHub
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/nifadhasanh21/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 bg-slate-800/80 hover:bg-teal-500 text-slate-300 hover:text-slate-950 rounded-xl transition-all duration-300 border border-slate-700/60 hover:border-teal-400 shadow-lg hover:shadow-teal-500/25 active:scale-95"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                    LinkedIn
                  </span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Department of Software Engineering, Daffodil International University.</p>
          <p>
            Designed & Maintained by{' '}
            <a 
              href="https://nifadhasan.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-teal-400 font-medium transition-colors"
            >
              nifadhasan.com
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}