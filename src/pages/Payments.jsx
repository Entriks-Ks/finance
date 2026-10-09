import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, Clock, AlertCircle, RefreshCw, Plus, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { useApp } from "../context/AppContext";
import { payments as initialPayments, companySettings } from "../data/mockData";

function fmt(n) {
  return "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Payments() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [items, setItems] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [syncing, setSyncing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: "INV-2026-0142",
    amount: "2450.00",
    method: "bank_transfer",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const filtered = items.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.invoiceNumber.toLowerCase().includes(q) || p.customerName.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalReceived = items.filter(i => i.status === "received").reduce((s, i) => s + i.amount, 0);
  const totalPending = items.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = items.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const handleSyncBank = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      addToast("Bank feed synced with Commerzbank AG. 2 new transactions matched.", "success");
    }, 1200);
  };

  const handleMarkReceived = (id) => {
    setItems(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: "received", paymentDate: new Date().toISOString().split("T")[0], method: "bank_transfer" }
          : p
      )
    );
    addToast("Payment marked as received.", "success");
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const match = items.find(p => p.invoiceNumber === form.invoiceNumber);
    if (match) {
      setItems(prev =>
        prev.map(p =>
          p.id === match.id
            ? { ...p, status: "received", amount: parseFloat(form.amount), paymentDate: form.paymentDate, method: form.method }
            : p
        )
      );
    } else {
      const newPay = {
        id: "pay" + Date.now(),
        invoiceNumber: form.invoiceNumber,
        customerName: "Customer",
        amount: parseFloat(form.amount) || 0,
        dueDate: form.paymentDate,
        paymentDate: form.paymentDate,
        method: form.method,
        status: "received"
      };
      setItems(prev => [newPay, ...prev]);
    }
    setModalOpen(false);
    addToast(`Payment of €${form.amount} recorded for ${form.invoiceNumber}`, "success");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Payments & Banking</h1>
          <p>Track cash inflows, reconcile bank settlements, and record incoming payments.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleSyncBank} disabled={syncing}>
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing..." : "Sync Bank Feed"}
          </button>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Record Payment
          </button>
        </div>
      </div>

      {/* Connected Bank Card */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, background: "linear-gradient(to right, #ffffff, #f8faff)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--gray-900)" }}>{companySettings.bank} Business Account</div>
            <div style={{ fontSize: 12, color: "var(--gray-400)" }}>
              IBAN: <span style={{ fontFamily: "monospace", letterSpacing: 0.5 }}>{companySettings.iban}</span> · BIC: {companySettings.bic}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "var(--gray-400)" }}>Current Ledger Balance</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}>€48,290.45</div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon green"><ArrowDownLeft size={16} /></div>
          <div className="kpi-label">Settled (Received)</div>
          <div className="kpi-value">{fmt(totalReceived)}</div>
          <div className="kpi-meta">{items.filter(i => i.status === "received").length} payments completed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon blue"><Clock size={16} /></div>
          <div className="kpi-label">Pending Inflows</div>
          <div className="kpi-value">{fmt(totalPending)}</div>
          <div className="kpi-meta">Awaiting customer clearance</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red"><AlertCircle size={16} /></div>
          <div className="kpi-label">Overdue Outstanding</div>
          <div className="kpi-value">{fmt(totalOverdue)}</div>
          <div className="kpi-meta">Reminders can be sent</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-input">
          <Search size={14} />
          <input
            placeholder="Search by invoice number or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All payment statuses</option>
          <option value="received">Received</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Payment Date</th>
              <th>Method</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <span
                    style={{ fontWeight: 600, color: "var(--primary)", cursor: "pointer" }}
                    onClick={() => navigate("/invoices")}
                  >
                    {p.invoiceNumber}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{p.customerName}</td>
                <td>
                  <span className="amount-cell" style={{ color: p.status === "received" ? "var(--success)" : "var(--gray-800)" }}>
                    {fmt(p.amount)}
                  </span>
                </td>
                <td>{p.dueDate || "—"}</td>
                <td>{p.paymentDate || "—"}</td>
                <td>
                  <span style={{ textTransform: "capitalize", background: "var(--gray-100)", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                    {p.method ? p.method.replace("_", " ") : "Direct"}
                  </span>
                </td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
                <td style={{ textAlign: "right" }}>
                  {p.status !== "received" ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMarkReceived(p.id)}
                    >
                      <CheckCircle size={13} /> Mark Received
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 500 }}>Reconciled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Customer Payment" width={500}>
        <form onSubmit={handleRecordPayment}>
          <div className="form-group">
            <label className="form-label required">Invoice Number</label>
            <input
              className="form-control"
              value={form.invoiceNumber}
              onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Amount Paid (€)</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Payment Method</label>
              <select
                className="form-control"
                value={form.method}
                onChange={e => setForm({ ...form, method: e.target.value })}
              >
                <option value="bank_transfer">Bank Transfer (SEPA)</option>
                <option value="paypal">PayPal</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Date Received</label>
            <input
              className="form-control"
              type="date"
              value={form.paymentDate}
              onChange={e => setForm({ ...form, paymentDate: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
