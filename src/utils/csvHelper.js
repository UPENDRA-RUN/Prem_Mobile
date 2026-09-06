/**
 * RFC 4180 CSV Parsing & Export Helpers
 */

/**
 * Parses a CSV string into an array of Javascript objects using headers in the first row.
 */
export function parseCsvText(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  const lines = splitCsvLines(csvText.trim());
  if (lines.length === 0) return [];

  const headers = parseCsvRow(lines[0]).map(h => h.trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const rowLine = lines[i].trim();
    if (!rowLine) continue;

    const values = parseCsvRow(rowLine);
    const obj = {};

    headers.forEach((header, colIdx) => {
      let val = values[colIdx] !== undefined ? values[colIdx].trim() : '';

      // Normalize boolean/numeric fields
      if (['regularPrice', 'offerPrice', 'price', 'stock', 'isActive', 'isFeatured', 'isBestSeller', 'isNew', 'id'].includes(header)) {
        if (val === 'true' || val === 'TRUE') val = 1;
        else if (val === 'false' || val === 'FALSE') val = 0;
        else if (val !== '' && !isNaN(val)) val = Number(val);
      }

      obj[header] = val;
    });

    // Skip empty rows with no product name
    if (obj.name) {
      results.push(obj);
    }
  }

  return results;
}

/**
 * Splits CSV content into line rows handling quoted multi-line fields.
 */
function splitCsvLines(csvText) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && csvText[i + 1] === '\n') {
        i++; // skip \n in CRLF
      }
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Parses a single CSV row line into field cells taking double quotes into account.
 */
function parseCsvRow(rowLine) {
  const fields = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < rowLine.length; i++) {
    const char = rowLine[i];
    if (char === '"') {
      if (inQuotes && rowLine[i + 1] === '"') {
        // Escaped double quote ("")
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }

  fields.push(currentField);
  return fields;
}

/**
 * Downloads text/csv content as a browser file attachment.
 */
export function downloadCsvFile(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
