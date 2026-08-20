import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { KPI_COLORS } from '../theme';
import type { MonthlySeriesPoint } from '../metrics';

export default function MonthlyBarChart({ points }: { points: MonthlySeriesPoint[] }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Monthly Ordered vs Received Value
      </Typography>
      <BarChart
        height={320}
        xAxis={[{ scaleType: 'band', data: points.map((p) => p.month) }]}
        series={[
          { data: points.map((p) => Math.round(p.ordered)), label: 'Ordered Value', color: KPI_COLORS.blue },
          { data: points.map((p) => Math.round(p.received)), label: 'Received Value', color: KPI_COLORS.green }
        ]}
      />
    </Paper>
  );
}
