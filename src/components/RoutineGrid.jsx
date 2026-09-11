import React from 'react';
import RoutineCard from './RoutineCard';

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:30-10:00',
  '10:00-11:30',
  '11:30-01:00',
  '01:00-02:30',
  '02:30-04:00',
  '04:00-05:30'
];

export default function RoutineGrid({ entries, title }) {
  const getEntry = (day, timeSlot) => {
    return entries.find(e => {
      const slotStart = timeSlot.split('-')[0];
      return e.day.toLowerCase() === day.toLowerCase() && e.start_time.includes(slotStart);
    });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" id="printable-routine">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-xs text-emerald-400 mt-0.5">Department of Software Engineering, DIU</p>
        </div>
        <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
          Weekly Schedule
        </span>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
              <th className="p-3 border-b border-r border-slate-200 w-28 text-center">Time Slot</th>
              {DAYS.map(day => (
                <th key={day} className="p-3 border-b border-r border-slate-200 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="border-b border-slate-100">
                <td className="p-2 border-r border-slate-200 text-xs font-semibold text-slate-500 text-center bg-slate-50">
                  {slot}
                </td>
                {DAYS.map((day) => (
                  <td key={`${day}-${slot}`} className="p-1.5 border-r border-slate-200 h-28 w-40 vertical-top">
                    <RoutineCard entry={getEntry(day, slot)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card Layout */}
      <div className="lg:hidden p-4 space-y-6">
        {DAYS.map(day => {
          const dayEntries = entries.filter(e => e.day.toLowerCase() === day.toLowerCase());
          if (dayEntries.length === 0) return null;

          return (
            <div key={day} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-slate-800 text-sm">
                {day}
              </div>
              <div className="p-3 grid gap-3 sm:grid-cols-2">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="border border-emerald-200 rounded-lg p-3 bg-emerald-50/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900">{entry.course_code}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        {entry.start_time} - {entry.end_time}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-2">{entry.course_name}</div>
                    <div className="text-xs text-slate-700 flex justify-between pt-2 border-t border-emerald-100">
                      <span>Teacher: <strong>{entry.teacher_initial}</strong></span>
                      <span>Batch: <strong>{entry.batch}-{entry.section}</strong></span>
                      <span>Room: <strong>{entry.room}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}