import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBox({ initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/routine?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter teacher initial or batch + section (e.g. SK, 48, 48A)..."
          className="w-full pl-4 pr-32 py-3.5 text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
        />
        <button
          type="submit"
          className="absolute right-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Generate</span>
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 justify-center text-xs text-slate-500">
        <span>Try searching:</span>
        <button type="button" onClick={() => { setQuery('SK'); navigate('/routine?q=SK'); }} className="underline hover:text-emerald-600 font-medium">SK</button>
        <span>•</span>
        <button type="button" onClick={() => { setQuery('48'); navigate('/routine?q=48'); }} className="underline hover:text-emerald-600 font-medium">48</button>
        <span>•</span>
        <button type="button" onClick={() => { setQuery('48A'); navigate('/routine?q=48A'); }} className="underline hover:text-emerald-600 font-medium">48A</button>
      </div>
    </form>
  );
}