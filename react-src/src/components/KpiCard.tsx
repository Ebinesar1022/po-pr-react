import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SvgIconComponent } from '@mui/icons-material';

interface KpiCardProps {
  icon: SvgIconComponent;
  value: string;
  label: string;
  color: string;
}

export default function KpiCard({ icon: Icon, value, label, color }: KpiCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderTop: `4px solid ${color}`,
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}22`
          }}
        >
          <Icon sx={{ color }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
