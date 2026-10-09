import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ToastContainer from "./components/Toast";

import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import IncomingInvoices from "./pages/IncomingInvoices";
import IncomingInvoiceDetail from "./pages/IncomingInvoiceDetail";
import AIReview from "./pages/AIReview";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import Products from "./pages/Products";
import RecurringInvoices from "./pages/RecurringInvoices";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <div className="main-area">
            <Topbar />
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Outgoing Invoices */}
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/create" element={<CreateInvoice />} />
              <Route path="/invoices/new" element={<CreateInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/invoices/:id/edit" element={<CreateInvoice />} />

              {/* Recurring Invoices */}
              <Route path="/recurring" element={<RecurringInvoices />} />

              {/* Incoming Invoices & AI Review */}
              <Route path="/incoming" element={<IncomingInvoices />} />
              <Route path="/incoming/:id" element={<IncomingInvoiceDetail />} />
              <Route path="/incoming/:id/review" element={<AIReview />} />

              {/* Customers */}
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />

              {/* Suppliers */}
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/:id" element={<SupplierDetail />} />

              {/* Products & Services */}
              <Route path="/products" element={<Products />} />

              {/* Payments & Banking */}
              <Route path="/payments" element={<Payments />} />

              {/* Financial Reports */}
              <Route path="/reports" element={<Reports />} />

              {/* Settings */}
              <Route path="/settings" element={<Settings />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
