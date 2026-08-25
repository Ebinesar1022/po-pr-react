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
  index?: number;
}

export default function KpiCard({ icon: Icon, value, label, color, index = 0 }: KpiCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: `4px solid ${color}`,
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        height: '100%',
        minHeight: 210,
        aspectRatio: '0.82 / 1',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        animation: 'kpiCardIn 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        animationDelay: `${index * 70}ms`,
        '&:hover': {
          transform: 'translateY(-4px) scale(1.01)',
          boxShadow: '0 14px 32px rgba(15, 23, 42, 0.14)'
        },
        '@keyframes kpiCardIn': {
          from: {
            opacity: 0,
            transform: 'translateY(14px) scale(0.98)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0) scale(1)'
          }
        }
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 1.5,
          px: 2.25,
          py: 2.25
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}18`,
            boxShadow: `inset 0 0 0 1px ${color}22`
          }}
        >
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.1, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.72rem' }}
          >
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
