import Papa from 'papaparse';
import { User, ColumnConfig } from '@/types';

interface CSVRow {
  Name?: string;
  name?: string;
  Email?: string;
  email?: string;
  Age?: string;
  age?: string;
  Role?: string;
  role?: string;
  Department?: string;
  department?: string;
  Location?: string;
  location?: string;
}

export const parseCSV = (file: File): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as CSVRow[];
        const users: User[] = data.map((row, index) => ({
          id: `imported-${Date.now()}-${index}`,
          name: row.Name || row.name || '',
          email: row.Email || row.email || '',
          age: parseInt(row.Age || row.age || '0') || 0,
          role: row.Role || row.role || '',
          department: row.Department || row.department || '',
          location: row.Location || row.location || '',
        }));
        resolve(users);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const exportToCSV = (data: User[], columns: ColumnConfig[]): void => {
  const visibleColumns = columns.filter(col => col.visible);
  const csvData = data.map(row => {
    const csvRow: Record<string, string | number> = {};
    visibleColumns.forEach(col => {
      csvRow[col.label] = row[col.key] || '';
    });
    return csvRow;
  });

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `table-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};