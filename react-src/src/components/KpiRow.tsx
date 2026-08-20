import Grid from '@mui/material/Grid';
import DescriptionIcon from '@mui/icons-material/Description';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import KpiCard from './KpiCard';
import { KPI_COLORS } from '../theme';
import type { Kpis } from '../metrics';

function fmtInt(n: number) {
  return Math.round(n).toLocaleString();
}

function fmtCurrency(n: number) {
  return '₹ ' + Math.round(n).toLocaleString('en-IN');
}

export default function KpiRow({ kpis }: { kpis: Kpis }) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard icon={DescriptionIcon} value={fmtInt(kpis.totalPOs)} label="Total Purchase Orders" color={KPI_COLORS.blue} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard icon={PendingActionsIcon} value={fmtInt(kpis.openPOs)} label="Open POs" color={KPI_COLORS.orange} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard icon={LocalShippingIcon} value={fmtInt(kpis.pendingReceipts)} label="Pending Receipts" color={KPI_COLORS.green} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard icon={ReportProblemIcon} value={fmtInt(kpis.failedInspection)} label="Failed Inspection" color={KPI_COLORS.red} />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <KpiCard icon={CurrencyRupeeIcon} value={fmtCurrency(kpis.totalPOValue)} label="Total PO Value" color={KPI_COLORS.purple} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KpiCard
          icon={AccessTimeIcon}
          value={kpis.avgFulfillmentDays.toFixed(1)}
          label="Avg Fulfillment Time (Days)"
          color={KPI_COLORS.teal}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KpiCard icon={GroupsIcon} value={fmtInt(kpis.suppliersInvolved)} label="Suppliers Involved" color={KPI_COLORS.yellow} />
      </Grid>
    </Grid>
  );
}
