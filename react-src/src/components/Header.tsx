import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Header() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(120deg, #0b1f2a, #0f3a4a)',
        color: '#fff',
        px: 4,
        py: 3
      }}
    >
      <Typography variant="h4" fontWeight={800}>
        Purchase Order &amp; Receive Performance Report
      </Typography>
    </Box>
  );
}
