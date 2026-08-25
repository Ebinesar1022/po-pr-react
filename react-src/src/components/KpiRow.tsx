import Box from '@mui/material/Box';
import DescriptionIcon from '@mui/icons-material/Description';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import KpiCard from './KpiCard';
import { KPI_COLORS } from '../theme';
import type { Kpis } from '../metrics';

function fmtInt(n: number) {
  return Math.round(n).toLocaleString();
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0
  }).format(Math.round(n));
}

export default function KpiRow({ kpis }: { kpis: Kpis }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: 2,
        mb: 3,
        overflowX: 'auto',
        pb: 0.5,
        '&::-webkit-scrollbar': {
          height: 8
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(148, 163, 184, 0.45)',
          borderRadius: 999
        }
      }}
    >
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard index={0} icon={DescriptionIcon} value={fmtInt(kpis.totalPOs)} label="Total Purchase Orders" color={KPI_COLORS.blue} />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard index={1} icon={PendingActionsIcon} value={fmtInt(kpis.openPOs)} label="Open POs" color={KPI_COLORS.orange} />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard index={2} icon={LocalShippingIcon} value={fmtInt(kpis.pendingReceipts)} label="Pending Receipts" color={KPI_COLORS.green} />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard index={3} icon={GppMaybeIcon} value={fmtInt(kpis.failedInspection)} label="Failed Inspection" color={KPI_COLORS.red} />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard
          index={4}
          icon={AccountBalanceWalletIcon}
          value={fmtCurrency(kpis.totalPOValue)}
          label="Total PO Value"
          color={KPI_COLORS.purple}
        />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard
          index={5}
          icon={AccessTimeIcon}
          value={kpis.avgFulfillmentDays.toFixed(1)}
          label="Avg Fulfillment Time (Days)"
          color={KPI_COLORS.teal}
        />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <KpiCard index={6} icon={GroupsIcon} value={fmtInt(kpis.suppliersInvolved)} label="Suppliers Involved" color={KPI_COLORS.yellow} />
      </Box>
    </Box>
  );
}
