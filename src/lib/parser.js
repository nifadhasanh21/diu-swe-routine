export const parseCSVData = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  const validRows = [];
  const invalidRows = [];

  lines.forEach((line, index) => {
    // Skip header line if detected
    if (index === 0 && (line.toLowerCase().includes('course') || line.toLowerCase().includes('day'))) return;

    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 5) {
      const [day, room, time, course, teacher] = parts;

      // Extract batch and section from Course string (e.g. MAT101-48-L -> Batch 48, Section L)
      const courseParts = course.split('-');
      const batch = courseParts[1] || '';
      const section = courseParts[2] || 'A';

      validRows.push({
        day: capitalizeDay(day),
        room,
        time,
        course_code: course.toUpperCase(),
        teacher_initial: teacher ? teacher.toUpperCase() : '',
        batch,
        section: section.toUpperCase()
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