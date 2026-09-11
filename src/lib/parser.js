export const parseCSVData = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  const validRows = [];
  const invalidRows = [];

  lines.forEach((line, index) => {
    // Skip header line if detected
    if (index === 0 && line.toLowerCase().includes('course_code')) return;

    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 8) {
      const [day, start_time, end_time, room, course_code, course_name, teacher_initial, batch, section] = parts;
      validRows.push({
        day: capitalizeDay(day),
        start_time,
        end_time,
        room,
        course_code: course_code ? course_code.toUpperCase() : '',
        course_name: course_name || 'N/A',
        teacher_initial: teacher_initial ? teacher_initial.toUpperCase() : '',
        batch,
        section: section ? section.toUpperCase() : 'A'
      });
    } else {
      invalidRows.push({ line, reason: 'Insufficient fields' });
    }
  });

  return { validRows, invalidRows };
};

const capitalizeDay = (day) => {
  if (!day) return 'Saturday';
  const clean = day.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};