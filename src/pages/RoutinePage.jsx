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

  // Instant image generation directly from exact previous design
  useEffect(() => {
    if (schedules.length > 0 && exportRef.current) {
      const renderInstantPreview = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const dataUrl = await toJpeg(exportRef.current, {
            quality: 0.98,
            pixelRatio: 2,
            backgroundColor: '#E8F5F3',
          });
          setPreviewImage(dataUrl);
        } catch (err) {
          console.error('Instant image preview error:', err);
        }
      };
      renderInstantPreview();
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
        pixelRatio: 3,
        backgroundColor: '#E8F5F3',
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
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-8 space-y-6 font-sans text-slate-900">
      {/* Search Header */}
      <div className="max-w-xl mx-auto space-y-3">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Teacher (e.g. SK) or Batch+Section (e.g. 43c)..."
            className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-xs md:text-sm"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-2xl shadow-sm text-xs md:text-sm whitespace-nowrap"
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

      {loading ? null : schedules.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-slate-500 font-medium">
              Found <strong className="text-slate-900">{schedules.length}</strong> classes
            </span>
            <button
              onClick={handleDownloadJPG}
              disabled={exporting}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>📥</span> {exporting ? 'Downloading...' : 'Download Routine'}
            </button>
          </div>

          {/* Exact Responsive Mobile Image View without Extra Text */}
          <div className="w-full bg-[#E8F5F3] border border-teal-200/80 rounded-2xl md:rounded-[32px] p-2 sm:p-4 shadow-xl">
            {previewImage && (
              <img
                src={previewImage}
                alt="Routine"
                className="w-full h-auto rounded-xl object-contain shadow-sm"
              />
            )}
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

      {/* Hidden Original Exact Routine Layout Engine */}
      <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        <div
          ref={exportRef}
          style={{ width: '1280px' }}
          className="bg-[#E8F5F3] p-6 space-y-4 box-border rounded-[32px] border border-teal-200"
        >
          {/* Exact Original Top Banner */}
          <div className="flex justify-between items-center pb-1">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-white border border-slate-300/80 rounded-xl text-xs font-semibold text-slate-700 shadow-sm">
                Effective From: 12 september 2026
              </div>

              {searchMeta.type === 'batch' ? (
                <div className="flex items-center gap-6 bg-white px-6 py-1.5 border border-slate-200 rounded-full shadow-sm">
                  <span className="text-xl font-black text-slate-800">
                    Section: <span className="text-teal-700">{searchMeta.section}</span>
                  </span>
                  <span className="text-xl font-black text-slate-800">
                    Batch: <span className="text-teal-700">{searchMeta.batch}</span>
                  </span>
                </div>
              ) : (
                <div className="bg-white px-5 py-1.5 border border-slate-200 rounded-full shadow-sm">
                  <span className="text-xl font-black text-slate-800">
                    Faculty: <span className="text-teal-700">{searchMeta.teacher}</span>
                  </span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black text-teal-800 tracking-tight">
                Department of Software Engineering
              </h1>
            </div>
          </div>

          {/* Exact Original Routine Grid Design */}
          <div className="grid grid-cols-8 gap-2.5 w-full">
            <div className="flex items-center justify-center font-bold text-slate-400 text-xs uppercase">
              TIME
            </div>

            {DAYS.map((day) => (
              <div
                key={day}
                className="bg-[#FF6B5B] text-white rounded-full flex items-center justify-center font-extrabold text-base shadow-sm h-[38px] truncate px-1"
              >
                {day}
              </div>
            ))}

            {TIME_SLOTS.map((slot) => (
              <React.Fragment key={slot}>
                <div className="flex items-center justify-center font-extrabold text-xs text-slate-800 text-center leading-tight">
                  {slot}
                </div>

                {DAYS.map((day) => {
                  const matchedClasses = getScheduleForSlot(day, slot);
                  const hasClass = matchedClasses.length > 0;

                  return (
                    <div
                      key={`${day}-${slot}`}
                      className={`rounded-2xl border flex flex-col justify-between p-1.5 min-h-[95px] ${
                        hasClass
                          ? 'bg-[#D1EFEA] border-teal-300 shadow-sm'
                          : 'bg-[#DFF1EE]/50 border-teal-100/60'
                      }`}
                    >
                      <div className="text-[9px] font-bold text-[#FF6B5B] text-center tracking-tight">
                        {slot}
                      </div>

                      {hasClass ? (
                        matchedClasses.map((item, idx) => {
                          const { codeOnly, fullName } = parseCourseDetails(item.course_code);
                          return (
                            <div key={idx} className="text-center my-auto px-0.5">
                              <div className="text-[10px] font-bold text-slate-900 leading-tight">
                                {fullName}
                              </div>
                              <div className="text-[9px] text-slate-600 font-semibold mt-0.5">
                                {codeOnly} {searchMeta.type === 'batch' ? `- ${item.teacher_initial}` : ''}
                              </div>
                              <div className="text-[9px] text-slate-600 font-semibold">
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

          {/* Exact Original Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-teal-200/60 text-[11px] font-bold text-slate-600">
            <span>sweroutine.com</span>
            <span className="px-3 py-0.5 bg-white rounded-full border border-slate-200 text-slate-600 font-medium text-[10px] shadow-sm">
              Generated from: sweroutine.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}