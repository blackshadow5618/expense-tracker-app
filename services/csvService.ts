import { Expense, Category } from '../types';

const CSV_HEADERS = ['id', 'description', 'amount', 'category', 'date', 'currency'];

/**
 * Converts an array of expenses into a CSV string.
 */
const convertToCSV = (expenses: Expense[]): string => {
  const rows = expenses.map(expense =>
    CSV_HEADERS.map(header => {
      let value = expense[header as keyof Expense];
      // Escape commas and quotes in description by quoting the whole field
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

/**
 * Triggers a file download in the browser.
 */
const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Exports expenses to a CSV file and triggers a download.
 */
export const exportToCSV = (expenses: Expense[]) => {
  // The UI component disables the button if there are no expenses.
  // We rely on that and remove the alert for better separation of concerns.
  const filename = `expenses-export-${new Date().toISOString().slice(0, 10)}.csv`;
  const csvString = convertToCSV(expenses);
  downloadCSV(csvString, filename);
};

// Robustly parses a single row of a CSV string.
const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            if (inQuotes && row[i+1] === '"') {
                // This is an escaped quote
                current += '"';
                i++; // Skip the next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current); // Add the last value
    return result;
};


/**
 * Parses a CSV file and returns an array of expenses.
 */
export const importFromCSV = (file: File): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvString = event.target?.result as string;
        const rows = csvString.split('\n').filter(row => row.trim() !== '');
        
        if (rows.length < 2) {
            return reject(new Error('CSV file is empty or contains only headers.'));
        }

        const headerRow = rows[0].trim().split(',');
        if (JSON.stringify(headerRow) !== JSON.stringify(CSV_HEADERS)) {
            return reject(new Error('Invalid CSV headers. Expected: ' + CSV_HEADERS.join(',')));
        }

        const importedExpenses: Expense[] = [];
        for (let i = 1; i < rows.length; i++) {
          const values = parseCSVRow(rows[i].trim());
          if (values.length !== CSV_HEADERS.length) {
            console.warn(`Skipping row ${i+1}: Incorrect number of columns.`);
            continue;
          }
          
          const [id, description, amount, category, date, currency] = values;

          const amountNum = parseFloat(amount);
          if (isNaN(amountNum)) {
            console.warn(`Skipping row ${i+1}: Invalid amount`);
            continue;
          }

          if (!Object.values(Category).includes(category as Category)) {
             console.warn(`Skipping row ${i+1}: Invalid category "${category}"`);
             continue;
          }

          importedExpenses.push({
            id,
            description,
            amount: amountNum,
            category: category as Category,
            date,
            currency,
          });
        }
        resolve(importedExpenses);
      } catch (error) {
        reject(new Error('Failed to parse CSV file.'));
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsText(file);
  });
};