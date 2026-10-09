import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { useApp } from "../context/AppContext";
import { customers as mockCustomers } from "../data/mockData";

function fmt(n) { return n > 0 ? "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2 }) : "—"; }
function fmtDate(d) { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]}`; }

export default function Customers() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "", vatId: "", contactPerson: "" });

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const handleSave = () => {
    if (!newCustomer.name) { addToast("Please enter a company name.", "error"); return; }
    const c = { ...newCustomer, id: "c" + Date.now(), invoiceCount: 0, outstanding: 0, lastInvoice: null, status: "active", country: "Germany" };
    setCustomers(prev => [c, ...prev]);
    setShowAddModal(false);
    setNewCustomer({ name: "", email: "", phone: "", address: "", vatId: "", contactPerson: "" });
    addToast("Customer created successfully.", "success");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h1>Customers</h1><p>Manage your customer accounts and billing information.</p></div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={14} /> Add customer</button>
      </div>
      <div className="toolbar">
        <div className="search-input"><Search size={14} /><input placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</span>
      </div>
      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-icon"><FileText size={24} /></div>
          <div className="empty-title">No customers found</div>
          <div className="empty-sub">Add your first customer to start creating invoices.</div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={14} /> Add customer</button>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr>
              <th>Customer</th><th>Email</th><th>Contact person</th>
              <th style={{ textAlign: "right" }}>Invoices</th>
              <th style={{ textAlign: "right" }}>Outstanding</th>
              <th>Last invoice</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => navigate(`/customers/${c.id}`)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{c.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{c.vatId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--primary)" }}><a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()} style={{ color: "inherit", textDecoration: "none" }}>{c.email}</a></td>
                  <td className="td-muted">{c.contactPerson}</td>
                  <td style={{ textAlign: "right" }}>{c.invoiceCount}</td>
                  <td style={{ textAlign: "right", fontWeight: c.outstanding > 0 ? 600 : 400, color: c.outstanding > 0 ? "var(--danger)" : "var(--gray-700)" }}>{fmt(c.outstanding)}</td>
                  <td className="td-muted">{fmtDate(c.lastInvoice)}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); navigate(`/invoices/create`); }}><Plus size={12} /> Invoice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add customer" size="md"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}><Plus size={14} /> Save customer</button></>}>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Company name *</label><input className="form-control" placeholder="ABC GmbH" value={newCustomer.name} onChange={e => setNewCustomer(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">VAT ID</label><input className="form-control" placeholder="DE123456789" value={newCustomer.vatId} onChange={e => setNewCustomer(p => ({ ...p, vatId: e.target.value }))} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" placeholder="finance@company.de" value={newCustomer.email} onChange={e => setNewCustomer(p => ({ ...p, email: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-control" placeholder="+49 30 12345678" value={newCustomer.phone} onChange={e => setNewCustomer(p => ({ ...p, phone: e.target.value }))} /></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-control" placeholder="Musterstraße 1, 10115 Berlin" value={newCustomer.address} onChange={e => setNewCustomer(p => ({ ...p, address: e.target.value }))} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Contact person</label><input className="form-control" placeholder="Thomas Müller" value={newCustomer.contactPerson} onChange={e => setNewCustomer(p => ({ ...p, contactPerson: e.target.value }))} /></div>
      </Modal>
    </div>
  );
}
