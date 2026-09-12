// search.js
export const parseSearchQuery = (query) => {
  if (!query) return null;
  const cleaned = query.trim();
  if (!cleaned) return null;

  // Regex 1: Batch + Section (e.g., "43c", "43 C", "48I", "44-B1")
  const batchSectionRegex = /^(\d{2,3})\s*[-_\s]?\s*([a-zA-Z]{1,4}\d?)$/;
  
  // Regex 2: Pure Teacher Initial (e.g., "SK", "ZT", "DKS", "FUA")
  const teacherRegex = /^[a-zA-Z]{2,4}$/;

  // Regex 3: Batch Only (e.g., "43", "48")
  const batchOnlyRegex = /^(\d{2,3})$/;

  let match = cleaned.match(batchSectionRegex);
  if (match) {
    return {
      type: 'batch_section',
      batch: match[1],
      section: match[2].toUpperCase(),
      query: cleaned,
      displayTitle: `Batch ${match[1]} (${match[2].toUpperCase()})`
    };
  }

  match = cleaned.match(teacherRegex);
  if (match) {
    return {
      type: 'teacher',
      teacherInitial: cleaned.toUpperCase(),
      query: cleaned.toUpperCase(),
      displayTitle: `Faculty Routine (${cleaned.toUpperCase()})`
    };
  }

  match = cleaned.match(batchOnlyRegex);
  if (match) {
    return {
      type: 'batch',
      batch: match[1],
      section: null,
      query: cleaned,
      displayTitle: `Batch ${match[1]} Routine`
    };
  }

  return {
    type: 'general',
    query: cleaned,
    displayTitle: `Search Results for "${cleaned}"`
  };
};

/**
 * Filter Routine Data based on search payload
 */
export const filterRoutineData = (routineList, parsedSearch) => {
  if (!parsedSearch || !routineList) return [];

  const { type, batch, section, teacherInitial, query } = parsedSearch;

  return routineList.filter((item) => {
    // Standardize course string format: "SE231-44-B1" -> batch: 44, section: B1
    const courseCode = item.Course || item.course_code || '';
    const teacher = (item.Teacher || item.teacher_initial || '').toUpperCase();

    if (type === 'teacher') {
      return teacher === teacherInitial;
    }

    if (type === 'batch_section') {
      const matchPattern = new RegExp(`-${batch}-${section}$`, 'i');
      return matchPattern.test(courseCode) || courseCode.toLowerCase().includes(`${batch}-${section}`.toLowerCase());
    }

    if (type === 'batch') {
      return courseCode.includes(`-${batch}-`);
    }

    // General fallback search
    return (
      courseCode.toLowerCase().includes(query.toLowerCase()) ||
      teacher.includes(query.toUpperCase()) ||
      (item.Room || '').toLowerCase().includes(query.toLowerCase())
    );
  });
};