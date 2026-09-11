import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('Fall 2026');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutines(data || []);
    } catch (err) {
      console.error('Error fetching routines:', err.message);
    }
  };

  const cleanStr = (str) => (str ? str.replace(/^["']|["']$/g, '').trim() : '');

  const parseCSV = (csvText) => {
    const lines = csvText
      .split(/\r\n|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => cleanStr(h).toLowerCase());
    const dataRows = lines.slice(1);

    return dataRows.map((line) => {
      const values = line.split(',').map((v) => cleanStr(v));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const handleSaveRoutine = async (e) => {
    e.preventDefault();

    if (!title || !semester || !effectiveDate || !file) {
      alert('Please complete all form fields and select a CSV file.');
      return;
    }

    setLoading(true);

    try {
      const text = await file.text();
      const parsedSchedules = parseCSV(text);

      if (parsedSchedules.length === 0) {
        throw new Error('CSV file is empty or invalid.');
      }

      const { data: routineData, error: routineError } = await supabase
        .from('routines')
        .insert([
          {
            title: title.trim(),
            semester: semester.trim(),
            effective_date: effectiveDate,
            status: 'Active',
          },
        ])
        .select()
        .single();

      if (routineError) throw routineError;

      const scheduleRecords = parsedSchedules.map((item) => ({
        routine_id: routineData.id,
        day: item.day || '',
        room: item.room || '',
        time_slot: item.time || item.time_slot || '',
        course_code: item.course || item.course_code || '',
        teacher_initial: item.teacher || item.teacher_initial || '',
      }));

      const { error: scheduleError } = await supabase
        .from('routine_schedules')
        .insert(scheduleRecords);

      if (scheduleError) throw scheduleError;

      alert('Routine saved and parsed successfully!');
      setTitle('');
      setEffectiveDate('');
      setFile(null);
      e.target.reset();
      fetchRoutines();
    } catch (err) {
      console.error('Save failed:', err);
      alert(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoutine = async (id) => {
    if (!window.confirm('Delete this routine and all associated records?')) return;
    try {
      const { error } = await supabase.from('routines').delete().eq('id', id);
      if (error) throw error;
      fetchRoutines();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-xs text-slate-500">Manage published department timetables</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Existing Routines Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Existing Routines</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    No routines saved yet.
                  </td>
                </tr>
              ) : (
                routines.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{r.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.semester}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.effective_date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 text-[10px] rounded-full font-bold">
                        {r.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRoutine(r.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Import New Routine</h2>
        <form onSubmit={handleSaveRoutine} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Routine Title
              </label>
              <input
                type="text"
                placeholder="e.g. SWE Fall 2026 Routine"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload CSV Routine Data
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs transition-all ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 shadow'
            }`}
          >
            {loading ? 'Saving Routine...' : 'Save & Store Routine'}
          </button>
        </form>
      </div>
    </div>
  );
}