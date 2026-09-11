import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center py-16 space-y-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      <p className="text-sm font-medium text-slate-500">Fetching active routine data...</p>
    </div>
  );
}