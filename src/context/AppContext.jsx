import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  invoices as initialInvoices,
  incomingInvoices as initialIncoming,
  customers as initialCustomers,
  suppliers as initialSuppliers,
  products as initialProducts,
  payments as initialPayments,
  companySettings as initialSettings,
  activityFeed as initialActivities
} from "../data/mockData";

const AppContext = createContext(null);

export const sampleReceipts = [
  {
    id: "sample-telekom",
    supplier: "Deutsche Telekom AG",
    supplierId: "s8",
    invoiceNumber: "TEL-2026-98124",
    invoiceDate: "2026-10-02",
    dueDate: "2026-10-16",
    net: 75.00,
    vat: 14.25,
    total: 89.25,
    iban: "DE34 5001 0517 0123 4567 89",
    bic: "DEUTDEDDFXX",
    reference: "TEL-2026-98124 KdNr-91823",
    category: "Telekommunikation & Internet (Konto 4920)",
    status: "pending_review",
    confidence: { supplier: 99, invoiceNumber: 98, invoiceDate: 97, dueDate: 95, net: 96, vat: 98, total: 99, iban: 94 },
    items: [{ desc: "Company Fiber 250/50 Mbit", qty: 1, net: 60.00, vat: 19 }, { desc: "Festnetz IP-Anschluss", qty: 1, net: 15.00, vat: 19 }],
    docInfo: { address: "Landgrabenweg 151, 53227 Bonn", taxId: "DE122265123", contact: "Telekom Geschäftskunden" }
  },
  {
    id: "sample-aws",
    supplier: "Amazon Web Services (AWS)",
    supplierId: "s3",
    invoiceNumber: "AWS-2026-09881",
    invoiceDate: "2026-09-30",
    dueDate: "2026-10-14",
    net: 346.64,
    vat: 65.86,
    total: 412.50,
    iban: "LU98 0019 4006 4470 0000 00",
    bic: "CHASLULLXXX",
    reference: "AWS-INV-09881-EU",
    category: "Cloud Hosting & Server (Konto 4910)",
    status: "pending_review",
    confidence: { supplier: 98, invoiceNumber: 99, invoiceDate: 98, dueDate: 92, net: 95, vat: 96, total: 99, iban: 91 },
    items: [{ desc: "EC2 Elastic Compute Cloud Frankfurt", qty: 1, net: 220.00, vat: 19 }, { desc: "RDS PostgreSQL Database Multi-AZ", qty: 1, net: 126.64, vat: 19 }],
    docInfo: { address: "38 Avenue John F. Kennedy, L-1855 Luxembourg", taxId: "LU26375245", contact: "AWS Billing EMEA" }
  },
  {
    id: "sample-office",
    supplier: "Office Partner GmbH",
    supplierId: "s2",
    invoiceNumber: "OP-772910",
    invoiceDate: "2026-10-05",
    dueDate: "2026-10-19",
    net: 113.28,
    vat: 21.52,
    total: 134.80,
    iban: "DE98 7654 3210 9876 5432 10",
    bic: "GENODED1OFF",
    reference: "RE-772910 Kd-3301",
    category: "Bürobedarf & Verbrauchsmaterial (Konto 4930)",
    status: "pending_review",
    confidence: { supplier: 96, invoiceNumber: 97, invoiceDate: 96, dueDate: 90, net: 94, vat: 95, total: 99, iban: 93 },
    items: [{ desc: "Kopierpapier Premium A4 (5x500 Blatt)", qty: 2, net: 45.00, vat: 19 }, { desc: "Tonerkassette HP LaserJet Black", qty: 1, net: 68.28, vat: 19 }],
    docInfo: { address: "Gewerbepark 12, 48653 Coesfeld", taxId: "DE812398471", contact: "Vertrieb B2B" }
  }
];

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [lang, setLang] = useState(() => localStorage.getItem("app_lang") || "de");

  // Reactive Collections with LocalStorage caching
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("app_invoices");
      return saved ? JSON.parse(saved) : initialInvoices;
    } catch { return initialInvoices; }
  });

  const [incomingInvoices, setIncomingInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("app_incoming_invoices");
      return saved ? JSON.parse(saved) : initialIncoming;
    } catch { return initialIncoming; }
  });

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem("app_customers");
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch { return initialCustomers; }
  });

  const [suppliers, setSuppliers] = useState(() => {
    try {
      const saved = localStorage.getItem("app_suppliers");
      return saved ? JSON.parse(saved) : initialSuppliers;
    } catch { return initialSuppliers; }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("app_products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch { return initialProducts; }
  });

  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem("app_payments");
      return saved ? JSON.parse(saved) : initialPayments;
    } catch { return initialPayments; }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("app_settings");
      return saved ? JSON.parse(saved) : initialSettings;
    } catch { return initialSettings; }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem("app_activities");
      return saved ? JSON.parse(saved) : initialActivities;
    } catch { return initialActivities; }
  });

  // Current receipt being reviewed or scanned
  const [currentScanReceipt, setCurrentScanReceipt] = useState(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("app_invoices", JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem("app_incoming_invoices", JSON.stringify(incomingInvoices)); }, [incomingInvoices]);
  useEffect(() => { localStorage.setItem("app_customers", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("app_suppliers", JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem("app_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("app_payments", JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem("app_settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("app_activities", JSON.stringify(activities)); }, [activities]);

  const setLanguage = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  }, []);

  const t = useCallback((de, en) => (lang === "de" ? de : en), [lang]);

  const addToast = useCallback((message, type = "success") => {
    if (!message) return;
    setToasts(prev => {
      // Prevent duplicate identical toast if already showing
      if (prev.some(t => t.message === message)) {
        return prev;
      }
      const id = Date.now() + Math.random();
      // Keep only up to 3 toasts at any time
      const nextToasts = [...prev, { id, message, type }].slice(-3);

      setTimeout(() => {
        setToasts(curr => curr.filter(t => t.id !== id));
      }, 3200);

      return nextToasts;
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Invoice Management Actions
  const createInvoice = useCallback((newInv) => {
    setInvoices(prev => [newInv, ...prev]);
    // increment sequential number
    setSettings(prev => ({ ...prev, nextInvoiceNumber: (prev.nextInvoiceNumber || 143) + 1 }));
    // add activity
    setActivities(prev => [
      {
        id: "act-" + Date.now(),
        type: "invoice_created",
        title: `Rechnung ${newInv.number} erstellt`,
        subtitle: `${newInv.customerName} · €${Number(newInv.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`,
        time: "Gerade eben",
        icon: "file-text"
      },
      ...prev
    ]);
  }, []);

  const updateInvoice = useCallback((id, updatedData) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updatedData } : inv));
  }, []);

  const deleteInvoice = useCallback((id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    addToast("Rechnung gelöscht.", "info");
  }, [addToast]);

  const markInvoicePaid = useCallback((id) => {
    let paidInv = null;
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        paidInv = { ...inv, status: "paid", paidDate: new Date().toISOString().split("T")[0] };
        return paidInv;
      }
      return inv;
    }));

    if (paidInv) {
      // Record payment
      setPayments(prev => [
        {
          id: "pay-" + Date.now(),
          invoiceNumber: paidInv.number,
          customerId: paidInv.customerId,
          customerName: paidInv.customerName,
          amount: paidInv.amount,
          dueDate: paidInv.dueDate,
          paymentDate: new Date().toISOString().split("T")[0],
          method: "bank_transfer",
          status: "received"
        },
        ...prev
      ]);
      // Record activity
      setActivities(prev => [
        {
          id: "act-" + Date.now(),
          type: "invoice_paid",
          title: `Zahlung für ${paidInv.number} verbucht`,
          subtitle: `${paidInv.customerName} · €${Number(paidInv.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`,
          time: "Gerade eben",
          icon: "check-circle"
        },
        ...prev
      ]);
    }
  }, []);

  // Incoming Invoice (Beleg) Management Actions
  const createIncomingInvoice = useCallback((billData) => {
    setIncomingInvoices(prev => [billData, ...prev]);
  }, []);

  const approveIncomingInvoice = useCallback((id, updatedFields) => {
    setIncomingInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          ...updatedFields,
          status: "approved"
        };
      }
      return inv;
    }));

    // Add activity
    const bill = incomingInvoices.find(b => b.id === id);
    const supplier = updatedFields?.supplier || bill?.supplier || "Lieferant";
    const total = updatedFields?.total || bill?.total || 0;
    setActivities(prev => [
      {
        id: "act-" + Date.now(),
        type: "incoming_uploaded",
        title: `Beleg von ${supplier} freigegeben`,
        subtitle: `€${Number(total).toLocaleString("de-DE", { minimumFractionDigits: 2 })} · Verbucht`,
        time: "Gerade eben",
        icon: "upload"
      },
      ...prev
    ]);
  }, [incomingInvoices]);

  const deleteIncomingInvoice = useCallback((id) => {
    setIncomingInvoices(prev => prev.filter(inv => inv.id !== id));
    addToast("Beleg entfernt.", "info");
  }, [addToast]);

  // Master Data Additions
  const addCustomer = useCallback((customer) => {
    const newCust = { id: "c" + Date.now(), ...customer, invoiceCount: 0, outstanding: 0, status: "active" };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  }, []);

  const addSupplier = useCallback((supplier) => {
    const newSupp = { id: "s" + Date.now(), ...supplier, openInvoices: 0, outstanding: 0, status: "active" };
    setSuppliers(prev => [newSupp, ...prev]);
    return newSupp;
  }, []);

  const addProduct = useCallback((product) => {
    const newProd = { id: "p" + Date.now(), ...product, status: "active" };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  }, []);

  return (
    <AppContext.Provider value={{
      sidebarCollapsed, setSidebarCollapsed,
      mobileSidebarOpen, setMobileSidebarOpen,
      toasts, addToast, removeToast,
      lang, setLanguage, t,
      invoices, setInvoices, createInvoice, updateInvoice, deleteInvoice, markInvoicePaid,
      incomingInvoices, setIncomingInvoices, createIncomingInvoice, approveIncomingInvoice, deleteIncomingInvoice,
      customers, addCustomer,
      suppliers, addSupplier,
      products, addProduct,
      payments, setPayments,
      settings, setSettings,
      activities,
      currentScanReceipt, setCurrentScanReceipt
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
