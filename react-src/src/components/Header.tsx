import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import FilterListIcon from '@mui/icons-material/FilterList';

export default function Header({ dateRangeLabel = 'May 1 – May 18, 2025' }: { dateRangeLabel?: string }) {
  const pillSx = {
    color: '#fff',
    borderColor: 'rgba(255,255,255,0.35)',
    bgcolor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    px: 2,
    '&:hover': { borderColor: 'rgba(255,255,255,0.6)', bgcolor: 'rgba(255,255,255,0.12)' }
  };

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
        <Button variant="outlined" startIcon={<CalendarTodayIcon fontSize="small" />} endIcon={<ExpandMoreIcon />} sx={pillSx}>
          {dateRangeLabel}
        </Button>
        {/* <Button variant="outlined" startIcon={<FilterListIcon fontSize="small" />} sx={pillSx}>
          Filters
        </Button> */}
      </Box>
    </Box>
  );
}
