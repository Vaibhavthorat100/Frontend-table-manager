import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { ColumnConfig, User } from '@/types';

interface ColumnManagerProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({
  open,
  onClose,
  columns,
  onColumnsChange,
}) => {
  const [newColumn, setNewColumn] = React.useState({ key: '', label: '' });

  const handleToggleColumn = (key: string) => {
    const updatedColumns = columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const handleAddColumn = () => {
    if (newColumn.key && newColumn.label) {
      const columnKey = newColumn.key.toLowerCase().replace(/\s+/g, '_');
      const updatedColumns = [
        ...columns,
        {
          key: columnKey as keyof User,
          label: newColumn.label,
          visible: true,
          editable: true,
        },
      ];
      onColumnsChange(updatedColumns);
      setNewColumn({ key: '', label: '' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Manage Columns
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <FormGroup>
          {columns.map((column) => (
            <FormControlLabel
              key={column.key}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => handleToggleColumn(column.key)}
                />
              }
              label={column.label}
            />
          ))}
        </FormGroup>

        <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Column Key"
            value={newColumn.key}
            onChange={(e) => setNewColumn({ ...newColumn, key: e.target.value })}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Column Label"
            value={newColumn.label}
            onChange={(e) => setNewColumn({ ...newColumn, label: e.target.value })}
            sx={{ mb: 1 }}
          />
          <Button
            startIcon={<Add />}
            onClick={handleAddColumn}
            variant="outlined"
            disabled={!newColumn.key || !newColumn.label}
          >
            Add New Column
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManager;