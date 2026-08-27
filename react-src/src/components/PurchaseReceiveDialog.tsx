import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import { isValidElement } from 'react';
import type { PurchaseReceive, ReceiveItem } from '../types';
import { poNumberOf } from '../metrics';

function displayValue(field: unknown): string {
  if (Array.isArray(field)) {
    return field.map(displayValue).filter(Boolean).join(', ');
  }
  if (field && typeof field === 'object') {
    const obj = field as any;
    return (
      [
        obj.zc_display_value,
        obj.display_value,
        obj.name,
        obj.Name,
        obj.label,
        obj.Label,
        obj.PO_Number,
        obj.Supplier_Name,
        obj.Warehouse_Name,
        obj.Inspection_By
      ]
        .map((v) => (typeof v === 'string' ? v.trim() : ''))
        .find(Boolean) ||
      [obj.first_name, obj.last_name].filter((v) => typeof v === 'string' && v.trim()).join(' ').trim() ||
      String(obj.ID ?? '')
    );
  }
  return String(field ?? '');
}

function num(v: unknown): string {
  if (v === null || v === undefined || v === '') return '-';
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : String(v);
}

function dateText(value: unknown): string {
  return String(value ?? '-');
}

function DetailField({ label, value }: { label: string; value: unknown }) {
  const rendered = isValidElement(value)
    ? value
    : typeof value === 'string' || typeof value === 'number'
      ? value
      : displayValue(value);
  return (
    <Box sx={{ minHeight: 74 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {rendered || '-'}
      </Typography>
    </Box>
  );
}

function statusChip(status: string) {
  const s = (status || '').toLowerCase();
  if (s.includes('partial')) {
    return <Box sx={{ display: 'inline-flex', px: 1.25, py: 0.5, borderRadius: 999, bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 700, fontSize: 12 }}>{status}</Box>;
  }
  if (s.includes('pending') || s.includes('fail') || s.includes('reject')) {
    return <Box sx={{ display: 'inline-flex', px: 1.25, py: 0.5, borderRadius: 999, bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: 12 }}>{status}</Box>;
  }
  return <Box sx={{ display: 'inline-flex', px: 1.25, py: 0.5, borderRadius: 999, bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 12 }}>{status || 'Received'}</Box>;
}

function itemLabel(item: ReceiveItem): string {
  return displayValue(item.Product_Name) || '-';
}

export default function PurchaseReceiveDialog({
  open,
  receive,
  items,
  onClose
}: {
  open: boolean;
  receive: PurchaseReceive | null;
  items: ReceiveItem[];
  onClose: () => void;
}) {
  const visibleItems = receive?.Receive_Items?.length ? receive.Receive_Items : items;
  const receiveItems = receive
    ? visibleItems.filter((item) => {
        const itemReceiveNo = displayValue(item.Receive_No);
        return itemReceiveNo === receive.Receive_No || itemReceiveNo === receive.ID;
      })
    : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 7, fontWeight: 700 }}>
        Purchase Receive Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent dividers sx={{ bgcolor: '#fbfcfe' }}>
        {!receive ? (
          <Typography color="text.secondary">No record selected.</Typography>
        ) : (
          <Box>
            <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <DetailField label="Receive No" value={receive.Receive_No} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Purchase Order No" value={poNumberOf(receive)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Receive Date" value={dateText(receive.Receive_Date)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Purchase Order Date" value={dateText(receive.Purchase_Order_Date)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Supplier" value={(receive as any).Supplier} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Warehouse" value={(receive as any).Warehouse} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Inspection By" value={(receive as any).Inspection_By} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Inspection Status" value={statusChip(receive.Inspection_Status)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Total Quantity" value={num(receive.Total_Quantity)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Total Received Quantity" value={num(receive.Total_Received_Quantity)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DetailField label="Total Pending Quantity" value={num(receive.Total_Pending_Quantity)} />
                </Grid>
                <Grid item xs={12} md={12}>
                  <DetailField label="Remark" value={(receive as any).Remark} />
                </Grid>
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                Receive Items
              </Typography>
              <TableContainer sx={{ maxHeight: 360 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Batch No</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>UOM</TableCell>
                      <TableCell align="right">Ordered Qty</TableCell>
                      <TableCell align="right">Received Qty</TableCell>
                      <TableCell align="right">Receivable Qty</TableCell>
                      <TableCell align="right">Pending Qty</TableCell>
                      <TableCell>Expiry Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receiveItems.length > 0 ? (
                      receiveItems.map((item) => (
                        <TableRow key={item.ID} hover>
                          <TableCell>{item.Batch_No || '-'}</TableCell>
                          <TableCell>{itemLabel(item)}</TableCell>
                          <TableCell>{displayValue(item.UOM) || '-'}</TableCell>
                          <TableCell align="right">{num(item.Ordered_Qty)}</TableCell>
                          <TableCell align="right">{num(item.Received_Qty)}</TableCell>
                          <TableCell align="right">{num(item.Receivable_Qty)}</TableCell>
                          <TableCell align="right">{num(item.Pending_Qty)}</TableCell>
                          <TableCell>{dateText(item.Expiry_Date)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No receive items found for this record.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
