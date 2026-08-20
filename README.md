# Purchase Order & Receive Performance Report — React (TSX) + MUI + ZET

A Zoho Creator widget (ZET-style project) built with React, TypeScript,
and MUI (including MUI X Charts for the donut and bar charts), matching
the layout in your reference image.

## IMPORTANT — build before uploading

`app/react/` only contains a placeholder until you run the build step
below. If you zip and upload this project without building first, the
widget will fail to load in Zoho Creator (missing entry file). See the
steps under "Build" — do this before packaging/uploading.

## Project structure

```
po-pr-react/
├── plugin-manifest.json      ZET/Creator widget manifest
├── package.json               root — runs the local https dev server
├── server/index.js            standard ZET dev server (serves /app)
├── key.pem / cert.pem         NOT included — generate locally, see below
├── react-src/                  <- EDIT HERE. React (TSX) + MUI source
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts         builds straight into ../app/react
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api.ts             Zoho data fetching + CONFIG block + v2 init
│       ├── zoho.d.ts          TypeScript types for window.ZOHO
│       ├── types.ts           PurchaseOrder / PurchaseReceive types
│       ├── metrics.ts         all KPI/derived calculations
│       ├── theme.ts           MUI theme + palette
│       └── components/
│           ├── Header.tsx
│           ├── KpiCard.tsx
│           ├── KpiRow.tsx
│           ├── StatusDonut.tsx
│           ├── TopSuppliers.tsx
│           ├── MonthlyBarChart.tsx
│           └── LatestReceivesTable.tsx
└── app/
    └── react/                  <- BUILD OUTPUT. Do not hand-edit.
```

## Forms used

| Panel | Form | Fields used |
|---|---|---|
| Total POs, Total PO Value, Suppliers Involved, Monthly "Ordered" | `Purchase_Order` | `PO_Number`, `PO_Date`, `Supplier_Name`, `Grand_Total` |
| Pending Receipts, Failed Inspection, Avg Fulfillment Time, Monthly "Received", Latest Receives table | `Purchase_Receive` | `Receive_No`, `Purchase_Order_No`, `Receive_Date`, `Purchase_Order_Date`, `Inspection_Status`, `Total_Quantity`, `Total_Received_Quantity`, `Total_Pending_Quantity` |
| POs by Fulfillment Status donut, Open POs | Both, joined via `Purchase_Order_No` → `Purchase_Order.ID` | see `buildStatusBreakdown()` in `metrics.ts` |

## Two things to verify/adjust before this is fully accurate

1. **`Inspection_Status` picklist values** — `metrics.ts` checks for
   `"failed"`, `"rejected"`, `"failed inspection"` (case-insensitive) to
   count "Failed Inspection". Your actual picklist labels weren't
   confirmed against the live form — open `metrics.ts` and adjust
   `FAILED_INSPECTION_VALUES` to match exactly.
2. **Monthly "Received Value"** — `Purchase_Receive` only carries
   quantities, not a monetary amount, so the monthly received value is
   *approximated* by prorating the linked PO's `Grand_Total` by the
   received-quantity ratio. If your `Receive_Items` line items carry a
   real unit price, replace this with a direct sum — see the comment
   above `buildMonthlySeries()` in `metrics.ts`.

## 1. Configure report names

Open `react-src/src/api.ts` and fix the `CONFIG` block — two report
names are marked `// <-- confirm` (Zoho usually names auto-generated
reports `All_<FormName>`, but yours may differ).

## 2. Build

```
cd react-src
npm install
npm run build
```

Confirm `app/react/index.html` and an `assets/` folder now exist —
not just the placeholder text file — before zipping/uploading.

## 3. Run locally against Zoho Creator

Generate a self-signed cert once:

```
openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
```

Then from the project root:

```
npm install
npm start
```

Open `https://127.0.0.1:<port>` once, accept the certificate warning
(Advanced → Proceed), then use
`https://127.0.0.1:<port>/app/react/index.html` as the widget URL when
configuring this in Zoho Creator.

## On "no init function"

This project uses the Widget SDK v2 promise-based pattern —
`window.ZOHO.CREATOR.init().then(...)` — a single call in `api.ts`'s
`initZoho()`, instead of the older two-step
`ZOHO.embeddedApp.on('PageLoad', ...)` + `ZOHO.embeddedApp.init()`
pattern used in earlier widgets.
