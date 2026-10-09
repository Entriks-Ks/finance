# FinanceApp

FinanceApp is a small-business finance workspace for writing customer invoices, scanning incoming bills, and keeping an eye on what is paid, open, or overdue. The interface is in German and English, and it adapts from desktop down to a phone.

There is no backend. Sample company data is loaded on first visit and then stored in the browser.

## Run it

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually `http://localhost:5173`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app with hot reload |
| `npm run build` | Build the production files into `dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## What you can do

- **Dashboard** shows collected revenue, outstanding and overdue amounts, expenses, a six-month chart, and tasks that need attention.
- **Invoices** can be created, edited, marked paid, and printed. The editor shows a live DIN 5008 preview with an EPC GiroCode QR for the bank transfer.
- **Incoming bills** can be uploaded or tried with sample receipts. The AI review screen lets you check extracted supplier, dates, amounts, and IBAN before booking the bill.
- **Customers, suppliers, and products** are listed with detail pages and can be added from the app.
- **Recurring invoices, payments, and reports** cover schedules, bank activity, profit and loss, and a VAT overview.
- **Notifications** open from the bell: overdue invoices, bills waiting for review, and recent activity. Each item links to the related record.
- **Settings** hold the company profile, tax details, bank account, and invoice defaults used on documents.
- **Search** in the top bar finds invoices, customers, and suppliers. The language button switches between German and English.

## Stack

React 19, React Router, Vite, Recharts, Lucide icons, and `qrcode.react`.
