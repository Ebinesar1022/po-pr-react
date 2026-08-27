export interface PurchaseOrder {
  ID: string;
  PO_Number: string;
  PO_Date: string;
  Supplier_Name: { ID: string; display_value?: string } | string;
  Grand_Total: number | string;
  Status: string;
}

export interface PurchaseReceive {
  ID: string;
  Receive_No: string;
  Purchase_Order_No: { ID: string; display_value?: string } | string;
  Receive_Date: string;
  Purchase_Order_Date: string;
  Supplier?: unknown;
  Warehouse?: unknown;
  Inspection_By?: unknown;
  Remark?: string;
  Inspection_Status: string;
  Total_Quantity: number | string;
  Total_Received_Quantity: number | string;
  Total_Pending_Quantity: number | string;
  Receive_Items?: ReceiveItem[];
}

export interface WarehouseData {
  purchaseOrders: PurchaseOrder[];
  purchaseReceives: PurchaseReceive[];
  receiveItems: ReceiveItem[];
}

export interface POLineItem {
  ID: string;
  PO_Number: { ID: string } | string;
  Product: { ID: string } | string;
  Unit_Price: number | string;
}

export interface ReceiveItem {
  ID: string;
  Receive_No: { ID: string } | string;
  Product_Name: { ID: string } | string;
  UOM?: { ID: string } | string;
  Batch_No?: string;
  Ordered_Qty?: number | string;
  Received_Qty: number | string;
  Receivable_Qty?: number | string;
  Expiry_Date?: string;
  Pending_Qty?: number | string;
}
