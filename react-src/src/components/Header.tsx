import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DateRangeFilter from './DateRangeFilter';
import type { DateRangeValue } from '../dateRange';

export default function Header({
  dateRange,
  onDateRangeChange
}: {
  dateRange: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue) => void;
}) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(120deg, #0b1f2a, #0f3a4a)',
        color: '#fff',
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Typography variant="h4" fontWeight={800}>
        Purchase Order &amp; Receive Performance Report
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
      </Box>
    </Box>
  );
}
