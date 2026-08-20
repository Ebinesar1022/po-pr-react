import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import type { SupplierValue } from '../metrics';

function fmtCurrency(n: number) {
  return '₹ ' + Math.round(n).toLocaleString('en-IN');
}

export default function TopSuppliers({ suppliers }: { suppliers: SupplierValue[] }) {
  const max = suppliers.length ? suppliers[0].value : 1;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Top Suppliers by PO Value
      </Typography>
      {suppliers.length === 0 && (
        <Typography variant="body2" color="text.secondary">No purchase order data available.</Typography>
      )}
      {suppliers.map((s) => (
        <Box key={s.name} sx={{ mb: 1.75 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{s.name}</Typography>
            <Typography variant="body2" fontWeight={700}>{fmtCurrency(s.value)}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={max > 0 ? (s.value / max) * 100 : 0}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#e5e9f0',
              '& .MuiLinearProgress-bar': { bgcolor: '#0d9488', borderRadius: 4 }
            }}
          />
        </Box>
      ))}
    </Paper>
  );
}
