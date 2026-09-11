export const parseSearchQuery = (query) => {
  if (!query) return null;
  const cleaned = query.trim();
  if (!cleaned) return null;

  // Regex patterns
  const batchSectionRegex = /^(\d{2,3})\s*([a-zA-Z]{1,4})$/;
  const batchOnlyRegex = /^(\d{2,3})$/;
  const teacherRegex = /^[a-zA-Z]{2,4}$/;

  let match = cleaned.match(batchSectionRegex);
  if (match) {
    return {
      type: 'batch_section',
      batch: match[1],
      section: match[2].toUpperCase(),
      displayTitle: `Batch ${match[1]} - Section ${match[2].toUpperCase()}`
    };
  }

  match = cleaned.match(batchOnlyRegex);
  if (match) {
    return {
      type: 'batch',
      batch: match[1],
      section: null,
      displayTitle: `Batch ${match[1]} Routine`
    };
  }

  match = cleaned.match(teacherRegex);
  if (match) {
    return {
      type: 'teacher',
      teacherInitial: cleaned.toUpperCase(),
      displayTitle: `Teacher Routine (${cleaned.toUpperCase()})`
    };
  }

  return {
    type: 'unknown',
    raw: cleaned,
    displayTitle: `Search Results for "${cleaned}"`
  };
};