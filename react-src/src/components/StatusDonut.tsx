import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { PieChart } from '@mui/x-charts/PieChart';
import { KPI_COLORS } from '../theme';
import type { StatusBreakdown } from '../metrics';

export default function StatusDonut({ status }: { status: StatusBreakdown }) {
  const total = status.received + status.partiallyReceived + status.notReceived;
  const rows = [
    { label: 'Received', value: status.received, color: KPI_COLORS.green },
    { label: 'Partially Received', value: status.partiallyReceived, color: KPI_COLORS.orange },
    { label: 'Not Received', value: status.notReceived, color: KPI_COLORS.blue }
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        POs by Fulfillment Status
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <PieChart
          series={[
            {
              data: rows.map((r) => ({ id: r.label, value: r.value, label: r.label, color: r.color })),
              innerRadius: 55,
              outerRadius: 90,
              paddingAngle: 1
            }
          ]}
          width={220}
          height={220}
          slotProps={{ legend: { hidden: true } }}
        />
        <Box sx={{ flex: 1, minWidth: 180 }}>
          {rows.map((r) => (
            <Box key={r.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} />
                <Typography variant="body2">{r.label}</Typography>
              </Box>
              <Typography variant="body2" fontWeight={700}>{r.value.toLocaleString()}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" fontWeight={700}>Total</Typography>
            <Typography variant="body2" fontWeight={700}>{total.toLocaleString()}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
