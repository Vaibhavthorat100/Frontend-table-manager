'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  setSearchTerm, 
  setSortConfig, 
  setCurrentPage, 
  setColumns,
  updateRow,
  deleteRow,
  setData 
} from '@/store/tableSlice';
import { toggleTheme } from '@/store/preferencesSlice';
import DataTable from '@/components/TableManager/DataTable';
import SearchBar from '@/components/UI/SearchBar';
import Pagination from '@/components/UI/Pagination';
import ColumnManager from '@/components/TableManager/ColumnManager';
import ImportExport from '@/components/TableManager/ImportExport';
import EditRowModal from '@/components/TableManager/EditRowModal';
import { User } from '@/types';
import { DarkMode, LightMode, Settings } from '@mui/icons-material';

export default function Home() {
  const dispatch = useDispatch();
  const {
    data,
    columns,
    searchTerm,
    sortConfig,
    currentPage,
    itemsPerPage,
    editingRow,
  } = useSelector((state: RootState) => state.table);
  
  const { theme } = useSelector((state: RootState) => state.preferences);
  
  const [columnManagerOpen, setColumnManagerOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<User | null>(null);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
    }

    // Apply sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        
        // Convert to string for consistent comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const handleSort = (key: keyof User) => {
    if (sortConfig?.key === key) {
      dispatch(setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      dispatch(setSortConfig({ key, direction: 'asc' }));
    }
  };

  const handleEdit = (row: User) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this row?')) {
      dispatch(deleteRow(id));
    }
  };

  const handleSaveEdit = (id: string, updates: Partial<User>) => {
    dispatch(updateRow({ id, updates }));
  };

  const handleImport = (importedData: User[]) => {
    dispatch(setData(importedData));
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Table Manager
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={() => dispatch(toggleTheme())}
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
              />
            }
            label={theme === 'dark' ? 'Dark' : 'Light'}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              User Data Table
            </Typography>
            <Button
              startIcon={<Settings />}
              onClick={() => setColumnManagerOpen(true)}
              variant="outlined"
            >
              Manage Columns
            </Button>
          </Box>

          <ImportExport
            onImport={handleImport}
            data={processedData}
            columns={columns}
          />

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(value) => dispatch(setSearchTerm(value))}
            placeholder="Search across all fields..."
          />

          <DataTable
            data={paginatedData}
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingRow={editingRow}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={processedData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />

          <ColumnManager
            open={columnManagerOpen}
            onClose={() => setColumnManagerOpen(false)}
            columns={columns}
            onColumnsChange={(newColumns) => dispatch(setColumns(newColumns))}
          />

          <EditRowModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            row={selectedRow}
            columns={columns}
            onSave={handleSaveEdit}
          />
        </Paper>
      </Container>
    </Box>
  );
}