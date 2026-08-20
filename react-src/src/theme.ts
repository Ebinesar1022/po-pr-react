import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: "'Inter', -apple-system, Segoe UI, Roboto, Arial, sans-serif"
  },
  palette: {
    background: { default: '#f4f6f9' },
    primary: { main: '#2563eb' },
    success: { main: '#16a34a' },
    warning: { main: '#f97316' },
    error: { main: '#ef4444' },
    secondary: { main: '#7c3aed' }
  },
  shape: { borderRadius: 10 }
});

export const KPI_COLORS = {
  blue: '#2563eb',
  orange: '#f97316',
  green: '#16a34a',
  red: '#ef4444',
  purple: '#7c3aed',
  teal: '#0d9488',
  yellow: '#eab308'
};
