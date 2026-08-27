import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './components/Header';
import KpiRow from './components/KpiRow';
import StatusDonut from './components/StatusDonut';
import TopSuppliers from './components/TopSuppliers';
import MonthlyBarChart from './components/MonthlyBarChart';
import LatestReceivesTable from './components/LatestReceivesTable';
import { loadWarehouseData } from './api';
import type { WarehouseData } from './types';
import { buildKpis, buildStatusBreakdown, buildTopSuppliers, buildMonthlySeries, sortLatestReceives } from './metrics';
import { isWithinRange, parseAppDate } from './dateRange';
import type { DateRangeValue } from './dateRange';

const EMPTY: WarehouseData = { purchaseOrders: [], purchaseReceives: [], receiveItems: [] };

type LoadState = 'loading' | 'ready' | 'error';

export default function App() {
  const [data, setData] = useState<WarehouseData>(EMPTY);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [dateRange, setDateRange] = useState<DateRangeValue>({ start: null, end: null });

  useEffect(() => {
    loadWarehouseData()
      .then((result) => {
        setData(result);
        setState('ready');
      })
      .catch((err) => {
        setErrorMsg(String(err));
        setState('error');
      });
  }, []);

  // Filter by the header's date range before anything downstream sees the
  // data. Purchase Orders are scoped by PO_Date, Purchase Receives by
  // Receive_Date — an unset range ("All Time") passes everything through.
  const purchaseOrders = useMemo(
    () => data.purchaseOrders.filter((po) => isWithinRange(parseAppDate(po.PO_Date), dateRange)),
    [data.purchaseOrders, dateRange]
  );
  const purchaseReceives = useMemo(
    () => data.purchaseReceives.filter((pr) => isWithinRange(parseAppDate(pr.Receive_Date), dateRange)),
    [data.purchaseReceives, dateRange]
  );

  const kpis = useMemo(() => buildKpis(purchaseOrders, purchaseReceives), [purchaseOrders, purchaseReceives]);
  const status = useMemo(() => buildStatusBreakdown(purchaseOrders), [purchaseOrders]);
  const topSuppliers = useMemo(() => buildTopSuppliers(purchaseOrders), [purchaseOrders]);
  const monthlySeries = useMemo(() => buildMonthlySeries(purchaseOrders, purchaseReceives), [purchaseOrders, purchaseReceives]);
  const latestReceives = useMemo(() => sortLatestReceives(purchaseReceives), [purchaseReceives]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      <Box sx={{ px: 4, py: 3 }}>
        {state === 'loading' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 6, justifyContent: 'center' }}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Loading data…</Typography>
          </Box>
        )}

        {state === 'error' && (
          <Typography color="error" sx={{ py: 4 }}>
            Could not load data. Check report names in src/api.ts CONFIG. ({errorMsg})
          </Typography>
        )}

        {state === 'ready' && (
          <>
            <KpiRow kpis={kpis} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={5}>
                <StatusDonut status={status} />
              </Grid>
              <Grid item xs={12} md={7}>
                <TopSuppliers suppliers={topSuppliers} />
              </Grid>
            </Grid>

            <MonthlyBarChart points={monthlySeries} />

            <LatestReceivesTable receives={latestReceives} receiveItems={data.receiveItems} />
          </>
        )}
      </Box>
    </Box>
  );
}
