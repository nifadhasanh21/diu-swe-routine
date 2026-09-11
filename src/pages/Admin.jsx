import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('Fall 2026');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    fetchRoutines();
  }, []);

  // Fetch routines from Supabase
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

  // Robust CSV parser that cleans quotes from lines and columns
  const parseCSV = (csvText) => {
    const lines = csvText
      .split(/\r\n|\n/)
      .map((line) => {
        let trimmed = line.trim();
        // Remove outer quotes wrapping entire row if present
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          trimmed = trimmed.substring(1, trimmed.length - 1);
        }
        return trimmed;
      })
      .filter((line) => line.length > 0);

    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(',')
      .map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    
    const dataRows = lines.slice(1);

    return dataRows.map((line) => {
      const values = line
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''));
      
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  // Upload and Save Routine handler
  const handleSaveRoutine = async (e) => {
    e.preventDefault();

    if (!title || !semester || !effectiveDate || !file) {
      alert('Please complete all form fields and select a valid CSV file.');
      return;
    }

    setLoading(true);

    try {
      // 1. Read & Parse CSV
      const text = await file.text();
      const parsedSchedules = parseCSV(text);

      if (parsedSchedules.length === 0) {
        throw new Error('CSV file is empty or missing headers.');
      }

      // 2. Insert Parent Routine Record
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

      // 3. Map CSV Columns to Schedule Rows
      const scheduleRecords = parsedSchedules.map((item) => ({
        routine_id: routineData.id,
        day: item.day || '',
        room: item.room || '',
        time_slot: item.time || item.time_slot || '',
        course_code: item.course || item.course_code || '',
        teacher_initial: item.teacher || item.teacher_initial || '',
      }));

      // 4. Batch Insert Child Schedules
      const { error: scheduleError } = await supabase
        .from('routine_schedules')
        .insert(scheduleRecords);

      if (scheduleError) throw scheduleError;

      alert('Routine successfully saved and published!');

      // Reset Form State
      setTitle('');
      setEffectiveDate('');
      setFile(null);
      e.target.reset();

      // Refresh list
      fetchRoutines();
    } catch (err) {
      console.error('Error saving routine:', err);
      alert(`Save failed: ${err.message || 'Check database permissions or file format.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete Routine
  const handleDeleteRoutine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) return;

    try {
      const { error } = await supabase.from('routines').delete().eq('id', id);
      if (error) throw error;
      fetchRoutines();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Control Center</h1>
          <p className="text-sm text-gray-500">Manage published department timetables</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Existing Routines Table */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Existing Routines</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 font-semibold uppercase text-xs">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    No routines saved yet.
                  </td>
                </tr>
              ) : (
                routines.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{r.title}</td>
                    <td className="py-3 px-4 text-gray-600">{r.semester}</td>
                    <td className="py-3 px-4 text-gray-600">{r.effective_date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {r.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRoutine(r.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
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

      {/* Import Form */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Import New Routine</h2>
        <form onSubmit={handleSaveRoutine} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Routine Title
              </label>
              <input
                type="text"
                placeholder="e.g. SWE Fall 2026 Routine"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Upload CSV Routine Data
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-900 shadow'
            }`}
          >
            {loading ? 'Saving Routine...' : 'Save & Store Routine'}
          </button>
        </form>
      </div>
    </div>
  );
}