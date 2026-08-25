import type { PurchaseOrder, PurchaseReceive } from './types';

function num(n: unknown): number {
  return Number(n) || 0;
}

function refId(field: unknown): string {
  if (field && typeof field === 'object' && 'ID' in (field as any)) {
    return String((field as any).ID);
  }
  return String(field ?? '');
}

function refLabel(field: unknown): string {
  if (field && typeof field === 'object' && 'display_value' in (field as any)) {
    return String((field as any).display_value ?? refId(field));
  }
  return String(field ?? '');
}

function monthKey(dateStr: string): string {
  // Expects Zoho's default dd-MMM-yyyy date format (per app config).
  // Falls back gracefully if parsing fails.
  const parts = (dateStr || '').split('-');
  return parts.length === 3 ? `${parts[1]}` : 'Unknown';
}

const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export interface Kpis {
  totalPOs: number;
  openPOs: number;
  pendingReceipts: number;
  failedInspection: number;
  totalPOValue: number;
  avgFulfillmentDays: number;
  suppliersInvolved: number;
}

export interface StatusBreakdown {
  received: number;
  partiallyReceived: number;
  notReceived: number;
}

export interface SupplierValue {
  name: string;
  value: number;
}

export interface MonthlySeriesPoint {
  month: string;
  ordered: number;
  received: number;
}

/**
 * NOTE on Inspection_Status matching: your exact picklist values
 * weren't confirmed against the live form, so this checks for common
 * variants case-insensitively. Adjust FAILED_INSPECTION_VALUES to
 * match your actual picklist labels exactly.
 */
const FAILED_INSPECTION_VALUES = ['failed', 'rejected', 'failed inspection'];

/**
 * Classifies every Purchase Order by its Status field, which the
 * Purchase_Order_Report form maintains directly as one of
 * "Received" / "Partially Received" / "Not Received".
 */
export function buildStatusBreakdown(purchaseOrders: PurchaseOrder[]): StatusBreakdown {
  let received = 0;
  let partiallyReceived = 0;
  let notReceived = 0;

  purchaseOrders.forEach((po) => {
    const status = String(po.Status || '').toLowerCase();
    if (status === 'received') received++;
    else if (status === 'partially received') partiallyReceived++;
    else notReceived++;
  });

  return { received, partiallyReceived, notReceived };
}

export function buildKpis(purchaseOrders: PurchaseOrder[], purchaseReceives: PurchaseReceive[]): Kpis {
  const status = buildStatusBreakdown(purchaseOrders);
  const totalPOValue = purchaseOrders.reduce((s, po) => s + num(po.Grand_Total), 0);
  const suppliersInvolved = new Set(purchaseOrders.map((po) => refId(po.Supplier_Name))).size;
  const pendingReceipts = purchaseReceives.filter((pr) => num(pr.Total_Pending_Quantity) > 0).length;
  const failedInspection = purchaseReceives.filter((pr) =>
    FAILED_INSPECTION_VALUES.includes(String(pr.Inspection_Status || '').toLowerCase())
  ).length;

  const fulfillmentDays: number[] = [];
  purchaseReceives.forEach((pr) => {
    const receiveDate = Date.parse(pr.Receive_Date);
    const poDate = Date.parse(pr.Purchase_Order_Date);
    if (!isNaN(receiveDate) && !isNaN(poDate)) {
      fulfillmentDays.push((receiveDate - poDate) / (1000 * 60 * 60 * 24));
    }
  });
  const avgFulfillmentDays = fulfillmentDays.length
    ? fulfillmentDays.reduce((s, d) => s + d, 0) / fulfillmentDays.length
    : 0;

  return {
    totalPOs: purchaseOrders.length,
    openPOs: status.partiallyReceived + status.notReceived,
    pendingReceipts,
    failedInspection,
    totalPOValue,
    avgFulfillmentDays,
    suppliersInvolved
  };
}

export function buildTopSuppliers(purchaseOrders: PurchaseOrder[], limit = 5): SupplierValue[] {
  const totals = new Map<string, number>();
  purchaseOrders.forEach((po) => {
    const name = refLabel(po.Supplier_Name) || 'Unknown Supplier';
    totals.set(name, (totals.get(name) || 0) + num(po.Grand_Total));
  });
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Monthly Ordered vs Received value.
 * "Ordered" = sum of Grand_Total for POs placed that month.
 * "Received" = approximated, since Purchase_Receive has quantities
 * but no monetary field. It prorates the linked PO's Grand_Total by
 * how much of that PO's quantity was received in that receipt:
 *   receivedValue = (Total_Received_Quantity / Total_Quantity) * PO.Grand_Total
 * Replace this with a direct line-item value sum if Receive_Items
 * carries unit price in your app.
 */
export function buildMonthlySeries(
  purchaseOrders: PurchaseOrder[],
  purchaseReceives: PurchaseReceive[]
): MonthlySeriesPoint[] {
  const poById = new Map<string, PurchaseOrder>();
  purchaseOrders.forEach((po) => poById.set(po.ID, po));

  const ordered = new Map<string, number>();
  purchaseOrders.forEach((po) => {
    const m = monthKey(po.PO_Date);
    ordered.set(m, (ordered.get(m) || 0) + num(po.Grand_Total));
  });

  const received = new Map<string, number>();
  purchaseReceives.forEach((pr) => {
    const po = poById.get(refId(pr.Purchase_Order_No));
    if (!po) return;
    const totalQty = num(pr.Total_Quantity);
    const receivedQty = num(pr.Total_Received_Quantity);
    const ratio = totalQty > 0 ? receivedQty / totalQty : 0;
    const value = ratio * num(po.Grand_Total);
    const m = monthKey(pr.Receive_Date);
    received.set(m, (received.get(m) || 0) + value);
  });

  return MONTH_ORDER.map((m) => ({
    month: m,
    ordered: ordered.get(m) || 0,
    received: received.get(m) || 0
  }));
}

export function sortLatestReceives(purchaseReceives: PurchaseReceive[], limit = 8): PurchaseReceive[] {
  return [...purchaseReceives]
    .sort((a, b) => (Date.parse(b.Receive_Date) || 0) - (Date.parse(a.Receive_Date) || 0))
    .slice(0, limit);
}

export function poNumberOf(pr: PurchaseReceive): string {
  return refLabel(pr.Purchase_Order_No);
}
