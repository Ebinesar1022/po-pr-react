import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import type { PurchaseReceive, ReceiveItem } from '../types';
import { poNumberOf } from '../metrics';
import PurchaseReceiveDialog from './PurchaseReceiveDialog';

function statusChip(status: string) {
  const s = (status || '').toLowerCase();
  if (s.includes('partial')) {
    return <Chip label={status} size="small" sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 700 }} />;
  }
  if (s.includes('pending') || s.includes('fail') || s.includes('reject')) {
    return <Chip label={status} size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }} />;
  }
  return <Chip label={status || 'Received'} size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }} />;
}

export default function LatestReceivesTable({
  receives,
  receiveItems
}: {
  receives: PurchaseReceive[];
  receiveItems: ReceiveItem[];
}) {
  const [selected, setSelected] = useState<PurchaseReceive | null>(null);

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Latest Purchase Receives
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Receive No</TableCell>
                <TableCell>PO Number</TableCell>
                <TableCell>Receive Date</TableCell>
                <TableCell>Inspection Status</TableCell>
                <TableCell align="right">Received Qty</TableCell>
                <TableCell align="right">Pending Qty</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {receives.map((r) => (
                <TableRow key={r.ID} hover sx={{ cursor: 'pointer' }}>
                  <TableCell>{r.Receive_No}</TableCell>
                  <TableCell>{poNumberOf(r)}</TableCell>
                  <TableCell>{r.Receive_Date}</TableCell>
                  <TableCell>{statusChip(r.Inspection_Status)}</TableCell>
                  <TableCell align="right">{Number(r.Total_Received_Quantity) || 0}</TableCell>
                  <TableCell align="right">{Number(r.Total_Pending_Quantity) || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setSelected(r)}>
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {receives.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                    No Purchase Receive records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PurchaseReceiveDialog
        open={Boolean(selected)}
        receive={selected}
        items={receiveItems}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
