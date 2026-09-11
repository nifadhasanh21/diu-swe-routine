import React from 'react';

export default function RoutineCard({ entry }) {
  if (!entry) {
    return (
      <div className="h-full min-h-[90px] border border-dashed border-slate-200 rounded-lg bg-slate-50/50 flex items-center justify-center">
        <span className="text-xs text-slate-300 font-medium">Free Slot</span>
      </div>
    );
  }

  return (
    <div className="h-full border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 rounded-lg p-2.5 flex flex-col justify-between shadow-sm transition border-l-4 border-l-emerald-500">
      <div>
        <div className="font-bold text-slate-900 text-sm leading-tight">{entry.course_code}</div>
        <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">{entry.course_name}</div>
      </div>
      <div className="mt-2 text-xs space-y-0.5 text-slate-700">
        <div className="flex justify-between">
          <span className="text-slate-500">Teacher:</span>
          <span className="font-semibold text-emerald-800">{entry.teacher_initial}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Batch/Sec:</span>
          <span className="font-medium">{entry.batch}-{entry.section}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Room:</span>
          <span className="font-medium text-slate-900 bg-white px-1 rounded border border-slate-200">{entry.room}</span>
        </div>
      </div>
    </div>
  );
}