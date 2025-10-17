import React, { useRef } from 'react';
import { Button, Box, Alert } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import { parseCSV, exportToCSV } from '@/utils/csvParser';
import { User, ColumnConfig } from '@/types';

interface ImportExportProps {
  onImport: (data: User[]) => void;
  data: User[];
  columns: ColumnConfig[];
}

const ImportExport: React.FC<ImportExportProps> = ({ onImport, data, columns }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = React.useState<string>('');

  const handleImportClick = () => {
    setImportError('');
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setImportError('Please select a CSV file');
      return;
    }

    try {
      const importedData = await parseCSV(file);
      onImport(importedData);
      setImportError('');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError('Failed to parse CSV file. Please check the format.');
      console.error('CSV parsing error:', error);
    }
  };

  const handleExport = () => {
    exportToCSV(data, columns);
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        style={{ display: 'none' }}
      />
      
      <Button
        startIcon={<Upload />}
        onClick={handleImportClick}
        variant="outlined"
        color="primary"
      >
        Import CSV
      </Button>
      
      <Button
        startIcon={<Download />}
        onClick={handleExport}
        variant="contained"
        color="primary"
      >
        Export CSV
      </Button>

      {importError && (
        <Alert severity="error" sx={{ ml: 2 }}>
          {importError}
        </Alert>
      )}
    </Box>
  );
};

export default ImportExport;