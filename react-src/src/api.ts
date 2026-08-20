import type { PurchaseOrder, PurchaseReceive, WarehouseData } from './types';

/* ================= CONFIGURATION =================
 * Adjust these to match your exact Zoho Creator app/report
 * names. Zoho auto-generates a report per form, usually
 * "All_<FormName>" — verify these in your app before use.
 * =================================================== */
export const CONFIG = {
  appName: 'divina-foods', // <-- confirm
  reports: {
    purchaseOrder: 'Purchase_Order_Report',
    purchaseReceive: 'Purchase_Receive_Report',
    poLineItems: 'PO_Line_Items_Report',
    receiveItems: 'Receive_Items_Report'
  }
};

async function fetchReport<T>(reportName: string): Promise<T[]> {
  const resp = await window.ZOHO.CREATOR.DATA.getRecords({
    appName: CONFIG.appName,
    reportName,
    maxRecords: 1000
  });
  return (resp && resp.data ? resp.data : []) as T[];
}

/**
 * Widget SDK v2 handshake. A single promise — no separate
 * embeddedApp.on('PageLoad', ...) + embeddedApp.init() pair.
 * Call this once, then fetch data once it resolves.
 */
export function initZoho(): Promise<void> {
  return window.ZOHO.CREATOR.init().then(() => undefined);
}

export async function loadWarehouseData(): Promise<WarehouseData> {
  const [purchaseOrders, purchaseReceives] = await Promise.all([
    fetchReport<PurchaseOrder>(CONFIG.reports.purchaseOrder),
    fetchReport<PurchaseReceive>(CONFIG.reports.purchaseReceive)
  ]);
  return { purchaseOrders, purchaseReceives };
}
