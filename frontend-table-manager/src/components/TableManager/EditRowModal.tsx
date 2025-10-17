import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { User, ColumnConfig } from '@/types';
import { validateUserData } from '@/utils/validators';

interface EditRowModalProps {
  open: boolean;
  onClose: () => void;
  row: User | null;
  columns: ColumnConfig[];
  onSave: (id: string, updates: Partial<User>) => void;
}

const EditRowModal: React.FC<EditRowModalProps> = ({
  open,
  onClose,
  row,
  columns,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Partial<User>>({});
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (row) {
      setFormData(row);
      setErrors([]);
    }
  }, [row]);

  const handleChange = (key: keyof User, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!row) return;

    const validation = validateUserData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(row.id, formData);
    onClose();
  };

  const visibleColumns = columns.filter(col => col.editable);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {visibleColumns.map((column) => (
            <TextField
              key={column.key}
              label={column.label}
              value={formData[column.key] || ''}
              onChange={(e) => handleChange(column.key, e.target.value)}
              type={column.key === 'age' ? 'number' : 'text'}
              fullWidth
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRowModal;