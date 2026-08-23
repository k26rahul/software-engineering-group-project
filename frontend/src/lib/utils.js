import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput) {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Exports an array of objects/arrays to a CSV file.
 * @param {string} filename The name of the file to be downloaded (e.g., 'report.csv')
 * @param {Array<string>} headers Array of column header names
 * @param {Array<Array<any>>} rows Array of rows, where each row is an array of values matching the headers
 */
export function exportToCSV(filename, headers, rows) {
  if (!rows || !rows.length) return;

  // Escape CSV values that contain commas, quotes, or newlines
  const escapeValue = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeValue).join(','),
    ...rows.map(row => row.map(escapeValue).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
