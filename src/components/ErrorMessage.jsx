import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ title = "No routine found.", message = "Please check the teacher initial or batch + section." }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center max-w-lg mx-auto my-8">
      <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600 mt-1">{message}</p>
    </div>
  );
}