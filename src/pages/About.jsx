import React from 'react';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 md:py-16 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            DAFFODIL INTERNATIONAL UNIVERSITY
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            About DIU SWE Routine Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            An enterprise-grade academic productivity platform designed specifically for students, faculty members, and administration within the Department of Software Engineering.
          </p>
        </div>

        {/* Vision & Objective Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Purpose & Objectives</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Managing academic schedules efficiently is critical for seamless campus operations. The DIU SWE Routine Portal eliminates manual lookup overhead by converting complex master schedules into instant, interactive, and high-definition visual timetables.
          </p>
        </div>

        {/* Supported Query Formats Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Supported Query Formats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Format 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-300 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md">
                  Faculty Lookup
                </span>
                <span className="text-xs text-slate-400 font-mono">e.g. SK, ZT</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Teacher Search</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Query by teacher initials to immediately inspect faculty workloads, room assignments, and weekly class times.
              </p>
            </div>

            {/* Format 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-300 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md">
                  Batch Level
                </span>
                <span className="text-xs text-slate-400 font-mono">e.g. 48, 43</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Batch Search</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter two-digit batch numbers to view complete aggregated class routines across all associated sections simultaneously.
              </p>
            </div>

            {/* Format 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-300 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md">
                  Section Specific
                </span>
                <span className="text-xs text-slate-400 font-mono">e.g. 48A, 43C</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Section Search</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter directly down to a specific section timetable for individual student groups with zero clutter.
              </p>
            </div>
          </div>
        </div>

        {/* Engineering & Developer Attribution */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-white">Engineered with Precision</h3>
            <p className="text-xs text-slate-400">
              Designed and developed by <a href="https://nifadhasan.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 font-semibold hover:underline">Nifad Hasan Eimu</a> for the Software Engineering Department.
            </p>
          </div>
          <a
            href="https://nifadhasan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 whitespace-nowrap"
          >
            Visit Developer Portfolio
          </a>
        </div>

      </div>
    </div>
  );
}