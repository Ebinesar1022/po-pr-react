import type { PurchaseOrder, PurchaseReceive, ReceiveItem, WarehouseData } from './types';

/* ================= CONFIGURATION =================
 * Adjust these to match your exact Zoho Creator app/report
 * names. Zoho auto-generates a report per form, usually
 * "All_<FormName>" — verify these in your app before use.
 * =================================================== */
export const CONFIG = {
  appName: 'divina-foods', 
  reports: {
    purchaseOrder: 'Purchase_Order_Report',
    purchaseReceive: 'Purchase_Receive_Report',
    poLineItems: 'PO_Line_Items_Report',
    receiveItems: 'Receive_Items_Report'
  }
};

async function fetchReport<T>(reportName: string): Promise<T[]> {
  const resp = await window.ZOHO.CREATOR.DATA.getRecords({
    app_name: CONFIG.appName,
    report_name: reportName,
    field_config: 'all',
    max_records: 1000
  });
  if (resp?.code !== 3000 || !resp.data) return [];
  return resp.data as T[];
}

export async function loadWarehouseData(): Promise<WarehouseData> {
  const [purchaseOrders, purchaseReceives, receiveItems] = await Promise.all([
    fetchReport<PurchaseOrder>(CONFIG.reports.purchaseOrder),
    fetchReport<PurchaseReceive>(CONFIG.reports.purchaseReceive),
    fetchReport<ReceiveItem>(CONFIG.reports.receiveItems)
  ]);
  return { purchaseOrders, purchaseReceives, receiveItems };
}
