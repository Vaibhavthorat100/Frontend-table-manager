import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  theme: 'light' | 'dark';
  columnOrder: string[];
}

const initialState: PreferencesState = {
  theme: 'light',
  columnOrder: ['name', 'email', 'age', 'role', 'department', 'location'],
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setColumnOrder: (state, action: PayloadAction<string[]>) => {
      state.columnOrder = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setTheme, setColumnOrder, toggleTheme } = preferencesSlice.actions;
export default preferencesSlice.reducer;