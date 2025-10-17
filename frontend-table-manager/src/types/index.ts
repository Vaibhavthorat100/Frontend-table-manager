export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
}

export interface TableState {
  data: User[];
  filteredData: User[];
  columns: ColumnConfig[];
  searchTerm: string;
  sortConfig: { key: keyof User; direction: 'asc' | 'desc' } | null;
  currentPage: number;
  itemsPerPage: number;
  editingRow: string | null;
}

export interface ColumnConfig {
  key: keyof User;
  label: string;
  visible: boolean;
  editable?: boolean;
}