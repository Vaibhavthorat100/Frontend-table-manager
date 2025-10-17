import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, TableState, ColumnConfig } from '@/types';

const initialColumns: ColumnConfig[] = [
  { key: 'name', label: 'Name', visible: true, editable: true },
  { key: 'email', label: 'Email', visible: true, editable: true },
  { key: 'age', label: 'Age', visible: true, editable: true },
  { key: 'role', label: 'Role', visible: true, editable: true },
  { key: 'department', label: 'Department', visible: false, editable: true },
  { key: 'location', label: 'Location', visible: false, editable: true },
];

const initialState: TableState = {
  data: [
    { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', age: 45, role: 'Manager' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', age: 29, role: 'Developer' },
    { id: '5', name: 'Tom Brown', email: 'tom@example.com', age: 35, role: 'Analyst' },
  ],
  filteredData: [],
  columns: initialColumns,
  searchTerm: '',
  sortConfig: null,
  currentPage: 1,
  itemsPerPage: 10,
  editingRow: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload;
      state.filteredData = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSortConfig: (state, action: PayloadAction<{ key: keyof User; direction: 'asc' | 'desc' }>) => {
      state.sortConfig = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setColumns: (state, action: PayloadAction<ColumnConfig[]>) => {
      state.columns = action.payload;
    },
    setEditingRow: (state, action: PayloadAction<string | null>) => {
      state.editingRow = action.payload;
    },
    updateRow: (state, action: PayloadAction<{ id: string; updates: Partial<User> }>) => {
      const { id, updates } = action.payload;
      const index = state.data.findIndex(row => row.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updates };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
  },
});

export const {
  setData,
  setSearchTerm,
  setSortConfig,
  setCurrentPage,
  setColumns,
  setEditingRow,
  updateRow,
  deleteRow,
} = tableSlice.actions;

export default tableSlice.reducer;