import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const QUICK_TAGS = ['SK', 'ZT', '43c', '48I'];

export default function SearchBox({ initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      navigate(`/routine?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickSearch = (tag) => {
    setQuery(tag);
    navigate(`/routine?q=${encodeURIComponent(tag)}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto my-4">
      {/* Input Group */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter teacher initial or batch + section (e.g. SK, 43c)..."
          className="w-full pl-5 pr-32 py-3.5 text-slate-900 placeholder-slate-400 bg-white border-2 border-emerald-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
        />
        <button
          type="submit"
          className="absolute right-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full shadow transition-all duration-200 flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Quick Search Options */}
      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
        <span>Quick search:</span>
        <div className="flex gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickSearch(tag)}
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}