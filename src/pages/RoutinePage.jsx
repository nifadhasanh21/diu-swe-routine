import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toJpeg } from 'html-to-image';

const COURSE_NAMES = {
  GE324: 'Business Analysis & Commun...',
  SE312: 'Software Quality Assurance...',
  SE225: 'Data Communication & Compu...',
  SE226: 'Lab C2 SE226 AMR / Lab C1 SE313 SNM',
  SE313: 'Lab C2 Software Quality As...',
  SE311: 'Design Pattern',
  MAT101: 'Mathematics I',
  MAT102: 'Mathematics II',
  STA101: 'Statistics & Probability',
  SE121: 'Structured Programming',
  SE235: 'Object Oriented Programming',
  PHY101: 'Physics I',
  SE232: 'Database Management System',
  SE223: 'Digital Electronics',
  SE411: 'Software Project Management',
};

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '8:30 - 10:00',
  '10:00 - 11:30',
  '11:30 - 1:00',
  '1:00 - 2:30',
  '2:30 - 4:00',
  '4:00 - 5:30',
  '5:30 - 7:00',
];

const normalizeTime = (rawTime) => {
  if (!rawTime) return '';
  let str = rawTime.replace(/\s+/g, '').replace(/\./g, ':');
  const parts = str.split('-');
  if (parts.length !== 2) return str;

  const pad = (tStr) => {
    if (tStr.includes(':')) {
      const [h, m] = tStr.split(':');
      return `${parseInt(h, 10)}:${m.padStart(2, '0')}`;
    }
    return tStr;
  };

  return `${pad(parts[0])}-${pad(parts[1])}`;
};

export default function RoutinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [searchMeta, setSearchMeta] = useState({ batch: '', section: '', teacher: '', type: '' });

  const exportRef = useRef(null);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    } else {
      setSchedules([]);
      setPreviewImage(null);
    }
  }, [query]);

  // Auto-generate preview image as soon as schedule data is loaded
  useEffect(() => {
    if (schedules.length > 0 && exportRef.current) {
      const generatePreview = async () => {
        try {
          // Slight delay to ensure DOM styling is rendered
          await new Promise((res) => setTimeout(res, 200));
          const dataUrl = await toJpeg(exportRef.current, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: '#00B589',
          });
          setPreviewImage(dataUrl);
        } catch (err) {
          console.error('Failed to generate preview image:', err);
        }
      };
      generatePreview();
    }
  }, [schedules]);

  const handleSearch = async (searchTerm) => {
    const rawInput = searchTerm.trim();
    if (!rawInput) return;

    setLoading(true);
    setPreviewImage(null);

    try {
      const batchSecRegex = /^(\d{2,3})[\s-]*([a-zA-Z])$/;
      const batchMatch = rawInput.match(batchSecRegex);

      let data = [];
      let error = null;

      if (batchMatch) {
        const batchNum = batchMatch[1];
        const sectionLetter = batchMatch[2].toUpperCase();
        const formattedPattern = `%-${batchNum}-${sectionLetter}%`;

        setSearchMeta({
          batch: batchNum,
          section: sectionLetter,
          teacher: '',
          type: 'batch',
        });

        const response = await supabase
          .from('routine_schedules')
          .select('*')
          .ilike('course_code', formattedPattern);

        data = response.data;
        error = response.error;
      } else {
        setSearchMeta({
          batch: '',
          section: '',
          teacher: rawInput.toUpperCase(),
          type: 'teacher',
        });

        const response = await supabase
          .from('routine_schedules')
          .select('*')
          .ilike('teacher_initial', rawInput);

        data = response.data;
        error = response.error;
      }

      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      console.error('Search error:', err.message);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const getScheduleForSlot = (day, timeSlot) => {
    const targetNorm = normalizeTime(timeSlot);

    return schedules.filter((item) => {
      const itemDay = item.day?.trim().toLowerCase();
      const targetDay = day.toLowerCase();

      const itemNorm = normalizeTime(item.time_slot);
      return itemDay === targetDay && itemNorm === targetNorm;
    });
  };

  const parseCourseDetails = (rawCode) => {
    if (!rawCode) return { codeOnly: '', fullName: 'Course Class' };
    const cleanCode = rawCode.split('-')[0].trim();
    const fullName = COURSE_NAMES[cleanCode] || cleanCode;
    return { codeOnly: cleanCode, fullName };
  };

  const handleDownloadJPG = async () => {
    if (!exportRef.current) return;
    setExporting(true);

    try {
      const dataUrl = await toJpeg(exportRef.current, {
        quality: 1.0,
        pixelRatio: 3, // Ultra High Quality
        backgroundColor: '#00B589',
      });

      const link = document.createElement('a');
      link.download = `Routine_${query.toUpperCase()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Could not export image. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans text-slate-900">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto space-y-3">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Teacher (e.g. SK) or Batch+Section (e.g. 43c)..."
            className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-sm text-sm whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 space-x-2">
          <span>Quick search:</span>
          {['SK', 'ZT', '43c', '48l'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearchInput(item);
                setSearchParams({ q: item });
              }}
              className="font-semibold text-teal-700 hover:underline px-1"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm font-medium">Generating routine image...</div>
      ) : schedules.length > 0 ? (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Routine Is Ready To Download!
          </h2>

          {/* Routine Image Card Preview (Mobile Exact Fit) */}
          <div className="max-w-3xl mx-auto bg-slate-100 p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-md">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Routine Preview"
                className="w-full h-auto rounded-xl object-contain shadow"
              />
            ) : (
              <div className="py-24 text-slate-400 text-xs font-semibold animate-pulse">
                Preparing mobile image view...
              </div>
            )}
          </div>

          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Click to Download button or Regenerate the routine
          </p>

          {/* Action Buttons (Red Download & Light Regenerate) */}
          <div className="flex justify-center items-center gap-3 pt-1">
            <button
              onClick={handleDownloadJPG}
              disabled={exporting}
              className="px-8 py-3.5 bg-[#FF4D4D] hover:bg-[#E03E3E] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-all active:scale-95 min-w-[140px]"
            >
              {exporting ? 'Saving...' : 'Download'}
            </button>

            <button
              onClick={() => handleSearch(query)}
              className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm sm:text-base rounded-xl shadow border border-slate-200 transition-all active:scale-95"
            >
              Regenerate
            </button>
          </div>
        </div>
      ) : (
        query && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto my-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">No Schedule Found</h3>
            <p className="text-xs text-slate-500">
              No classes found for "<strong>{query}</strong>".
            </p>
          </div>
        )
      )}

      {/* Hidden Master Engine Element for Image Generation */}
      <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        <div
          ref={exportRef}
          style={{ width: '1280px' }}
          className="bg-[#00B589] p-6 text-white space-y-4 box-border font-sans rounded-3xl"
        >
          {/* Header Banner */}
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg border border-white/30">
                Effective From: 12 september 2026
              </span>
              {searchMeta.type === 'batch' ? (
                <div className="flex items-center gap-4 bg-white/20 px-4 py-1 rounded-full border border-white/30 text-white font-black text-sm">
                  <span>Section: {searchMeta.section}</span>
                  <span>Batch: {searchMeta.batch}</span>
                </div>
              ) : (
                <div className="bg-white/20 px-4 py-1 rounded-full border border-white/30 text-white font-black text-sm">
                  Faculty: {searchMeta.teacher}
                </div>
              )}
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black uppercase tracking-tight text-white">
                Department of Software Engineering
              </h1>
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="grid grid-cols-8 gap-2">
            <div className="flex items-center justify-center font-bold text-white/80 text-xs uppercase">
              Time
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="bg-[#FF6B5B] text-white font-extrabold text-xs py-2 text-center rounded-full shadow"
              >
                {day}
              </div>
            ))}

            {TIME_SLOTS.map((slot) => (
              <React.Fragment key={slot}>
                <div className="flex items-center justify-center font-extrabold text-white text-[11px] text-center leading-tight">
                  {slot}
                </div>

                {DAYS.map((day) => {
                  const matchedClasses = getScheduleForSlot(day, slot);
                  const hasClass = matchedClasses.length > 0;

                  return (
                    <div
                      key={`${day}-${slot}`}
                      className={`rounded-2xl border p-2 min-h-[90px] flex flex-col justify-between ${
                        hasClass
                          ? 'bg-white text-slate-900 border-white shadow-sm'
                          : 'bg-white/10 border-white/20'
                      }`}
                    >
                      <div className={`text-[9px] font-bold text-center ${hasClass ? 'text-[#FF6B5B]' : 'text-white/60'}`}>
                        {slot}
                      </div>

                      {hasClass ? (
                        matchedClasses.map((item, idx) => {
                          const { codeOnly, fullName } = parseCourseDetails(item.course_code);
                          return (
                            <div key={idx} className="text-center my-auto space-y-0.5">
                              <div className="font-bold text-[10px] text-slate-900 leading-tight">
                                {fullName}
                              </div>
                              <div className="text-[9px] text-slate-600 font-bold">
                                {codeOnly} {searchMeta.type === 'batch' ? `- ${item.teacher_initial}` : ''}
                              </div>
                              <div className="text-[9px] text-teal-800 font-extrabold">
                                Room: {item.room}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full" />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Image Footer */}
          <div className="flex justify-between items-center text-xs font-bold text-white/90 pt-2 border-t border-white/20">
            <span>DiuRoutine.com</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-[10px]">
              Generated from: diuroutine.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}