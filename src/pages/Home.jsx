import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/routine?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleQuickSearch = (term) => {
    navigate(`/routine?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 font-sans text-slate-900 flex flex-col justify-center items-center px-4 py-12 md:py-20 selection:bg-teal-500 selection:text-white">
      <main className="max-w-5xl mx-auto w-full text-center space-y-10">
        
        {/* Department Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide shadow-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          DEPARTMENT OF SOFTWARE ENGINEERING
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find Your Class Routine in Seconds
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            The official schedule portal for DIU SWE students and faculty. Query routines by teacher initial, batch, or section.
          </p>
        </div>

        {/* Central Search Card */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-2 sm:p-3 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-3">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter teacher initial or batch + section (e.g. SK, 43C, 48)..."
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200/70 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Search Schedule</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Popular searches:</span>
            {['SK', '43C', 'ZT', '48A'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickSearch(tag)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-slate-600 font-semibold rounded-lg border border-slate-200 transition-all text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full pt-6 text-left">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-slate-900">Faculty Timelines</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lookup individual teacher initials (e.g., SK, ZT) to retrieve exact weekly course schedules and allocated rooms.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-slate-900">Batch & Section Views</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Query entire batches (e.g. 48) or specific sections (e.g. 43C) to monitor student group class timetables seamlessly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-slate-900">High-Res Export</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export generated timetables into crisp, high-definition JPG images suitable for mobile wallpapers and offline access.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}