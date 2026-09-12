import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toJpeg } from 'html-to-image';

const COURSE_NAMES = {
  SE111: 'Computer Fundamentals',
  SE112: 'Computer Fundamentals Lab',
  SE113: 'Introduction to Software Engineering',
  ENG101: 'English I',
  BNS101: 'Bangladesh Studies',
  MAT101: 'Mathematics I',
  SE121: 'Structured Programming',
  SE122: 'Structured Programming Lab',
  SE123: 'Discrete Mathematics',
  SE212: 'Software Requirements Specification & Analysis',
  SE213: 'Digital Electronics & Logic Design',
  PHY101: 'Physics I',
  MAT102: 'Mathematics II',
  SE131: 'Data Structure',
  SE132: 'Data Structure Lab',
  SE133: 'Software Development Capstone Project',
  SE216: 'Object Oriented Programming',
  SE217: 'Object Oriented Programming Lab',
  SE222: 'Computer Architecture',
  STA101: 'Statistics & Probability',
  AOL101: 'Art of Living',
  SE211: 'Object Oriented Concepts',
  SE221: 'Object Oriented Design',
  SE214: 'Algorithm Design & Analysis',
  SE215: 'Algorithm Design and Analysis Lab',
  SE235: 'Desktop & Web Programming',
  SE236: 'Desktop & Web Programming Lab',
  SE223: 'Database System',
  SE224: 'Database Systems Lab',
  SE232: 'Operating System and System Programming',
  SE233: 'Operating System & System Programming Lab',
  GE235: 'Principles of Accounting, Business and Economics',
  SE532: 'Introduction to Robotics',
  SE225: 'Data Communication & Computer Networking',
  SE226: 'Data Communication and Networking Lab',
  SE231: 'System Analysis & Design Capstone Project',
  SE234: 'Theory of Computing',
  SE311: 'Design Pattern',
  SE312: 'Software Quality Assurance & Testing',
  SE313: 'Software Quality Assurance & Testing Lab',
  GE324: 'Business Analysis & Communication',
  SE321: 'Software Engineering Web Application',
  SE322: 'Software Engineering Web Application Lab',
  SE323: 'Software Architecture & Design',
  SE332: 'Information System Security',
  SE342: 'Compiler Design',
  SE441: 'Software Engineering Professional Ethics',
  SE411: 'Software Project Management',
  SE333: 'Artificial Intelligence',
  SE334: 'Artificial Intelligence Lab',
  SE544: 'Introduction to Machine Learning',
  SE331: 'Software Engineering Design Capstone Project',
  EMP101: 'Employability 360',
  SE444: 'Data Warehouse and Data Mining',
  SE447: 'Human Computer Interaction',
  SE599: 'Research Methodology & Scientific Writing',
  SE442: 'Management Information System',
  RE331: 'Embedded Programming',
  RE332: 'Embedded Programming Lab',
  RE411: 'Embedded System Design and Development',
  RE412: 'Embedded System Design and Development Lab',
  RE421: 'Robotic Process Automation Design & Development',
  RE422: 'Robotic Process Automation Design & Development Lab',
  CS211: 'Cyber Security Fundamentals',
  CS418: 'Network & Communication Security',
  CS422: 'Digital Forensics',
  DS331: 'Introduction to Data Science and Data Management & Analysis',
  DS332: 'Introduction to Data Science and Data Management & Analysis Lab',
  DS411: 'Statistical Data Analysis',
  DS412: 'Statistical Data Analysis Lab',
  DS421: 'Machine Learning Driven Data Analysis I',
  DS422: 'Machine Learning Driven Data Analysis Lab',
  SE431: 'Numerical Analysis',
  RE423: 'Advanced Robotics',
  RE424: 'Advanced Robotics Lab',
  CS335: 'Ethical Hacking and Countermeasure Lab',
  DS423: 'Machine Learning Driven Data Analysis II and Communicating Data Insights',
  CS334: 'Ethical Hacking and Countermeasure',
  DS424: 'Machine Learning Driven Data Analysis II and Communication Data Insights Lab',
  ST411: 'Agile Testing',
  ST412: 'Agile Testing Lab',
  ST421: 'Testing with Generative AI',
  ST422: 'Testing with Generative AI Lab',
  ST413: 'Test Automation & Test Management',
  ST414: 'Test Automation & Test Management Lab',
  ST423: 'Software Performance Engineering & Security Testing',
  ST424: 'Software Performance Engineering & Security Testing Lab',
  GEDS237: 'Entrepreneurship in IT Business',
  SE345: 'AI System & Application Development',
  SE346: 'AI Systems & Application Development Lab',
  SE344: 'Distributed Systems and Cloud Computing',
  GEDS416: 'AI for Strategic Decision Making',
  SE343: 'Software Maintenance',
};

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '8:30 - 10:00',
  '10:00 - 11:30',
  '11:30 - 1:00',
  '1:00 - 2:30',
  '2:30 - 4:00',
  '4:00 - 5:30',
];

const normalizeTime = (rawTime) => {
  if (!rawTime) return '';
  let str = rawTime.toString().trim().replace(/\s+/g, '').replace(/\./g, ':');
  const parts = str.split('-');
  if (parts.length !== 2) return str;

  const pad = (tStr) => {
    if (tStr.includes(':')) {
      const [h, m] = tStr.split(':');
      const parsedH = parseInt(h, 10);
      return `${parsedH}:${m.padStart(2, '0')}`;
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

  useEffect(() => {
    if (schedules.length > 0 && exportRef.current) {
      const renderInstantPreview = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 150));
          if (!exportRef.current) return;
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
      const batchSecRegex = /^(\d{2,3})[\s-]*([a-zA-Z0-9]+)$/;
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

    let groupLabel = '';
    const parts = rawCode.split('-');
    if (parts.length >= 3) {
      const secGroup = parts[2].trim().toUpperCase();
      if (secGroup.length > 1) {
        groupLabel = `Lab ${secGroup} - `;
      }
    }

    const baseName = COURSE_NAMES[cleanCode] || cleanCode;
    const fullName = `${groupLabel}${baseName}`;
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
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 space-y-6 font-sans text-slate-900">
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

      {loading ? (
        <div className="text-center py-8 text-xs text-slate-500">Loading schedule...</div>
      ) : schedules.length > 0 ? (
        /* diuroutine.com Style Clean Card Container */
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 max-w-2xl mx-auto">
          {/* Header Status Message */}
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center justify-center gap-1.5">
              Your routine is ready to download
            </h2>
            <p className="text-xs text-slate-500">
              Found <strong>{schedules.length}</strong> classes for <strong>{query.toUpperCase()}</strong>
            </p>
          </div>

          {/* Mobile Optimized Image View Container */}
          <div className="w-full bg-[#E8F5F3] border border-teal-200/80 rounded-2xl p-2 sm:p-3 shadow-inner flex justify-center items-center overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Routine Preview"
                className="w-full h-auto max-h-[65vh] object-contain rounded-xl shadow-sm"
              />
            ) : (
              <div className="py-12 text-xs text-teal-800 font-medium">Generating routine preview...</div>
            )}
          </div>

          {/* Action Button Located Cleanly Below Image */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleDownloadJPG}
              disabled={exporting || !previewImage}
              className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>📥</span> {exporting ? 'Downloading...' : 'Download Routine'}
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

      {/* Hidden Render Container for HTML-to-Image Export */}
      <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        <div
          ref={exportRef}
          style={{ width: '1380px' }}
          className="bg-[#E8F5F3] p-6 space-y-4 box-border rounded-[32px] border border-teal-200"
        >
          {/* Top Banner */}
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

          {/* Routine Grid Design */}
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
                                {codeOnly}{' '}
                                {searchMeta.type === 'batch'
                                  ? `- ${item.teacher_initial}`
                                  : ''}
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

          {/* Footer */}
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