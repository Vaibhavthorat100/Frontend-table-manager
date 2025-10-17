import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Edit, Delete, DragIndicator } from '@mui/icons-material';
import { User, ColumnConfig } from '@/types';

interface DataTableProps {
  data: User[];
  columns: ColumnConfig[];
  sortConfig: { key: keyof User; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof User) => void;
  onEdit: (row: User) => void;
  onDelete: (id: string) => void;
  editingRow: string | null;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  editingRow,
}) => {
  const visibleColumns = columns.filter(col => col.visible);

  const getSortIcon = (key: keyof User) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableCell
                key={column.key}
                onClick={() => onSort(column.key)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: 'action.selected' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DragIndicator sx={{ fontSize: 16, opacity: 0.5 }} />
                  {column.label} {getSortIcon(column.key)}
                </Box>
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: editingRow === row.id ? 'action.selected' : 'inherit',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              {visibleColumns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === 'role' ? (
                    <Chip 
                      label={row[column.key]} 
                      size="small" 
                      color={row[column.key] === 'Manager' ? 'primary' : 'default'}
                    />
                  ) : (
                    row[column.key] || '-'
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(row)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(row.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;