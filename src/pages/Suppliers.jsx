import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Truck, ArrowLeft, CheckCircle } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { useApp } from "../context/AppContext";
import { suppliers as mockSuppliers } from "../data/mockData";

function fmt(n) { return n > 0 ? "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2 }) : "—"; }
function fmtDate(d) { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]}`; }

export default function Suppliers() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", email: "", phone: "", address: "", vatId: "", iban: "" });

  const filtered = suppliers.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!newSupplier.name) { addToast("Please enter a company name.", "error"); return; }
    setSuppliers(prev => [{ ...newSupplier, id: "s" + Date.now(), openInvoices: 0, outstanding: 0, lastInvoice: null, status: "active", country: "Germany" }, ...prev]);
    setShowAddModal(false);
    setNewSupplier({ name: "", email: "", phone: "", address: "", vatId: "", iban: "" });
    addToast("Supplier added successfully.", "success");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h1>Suppliers</h1><p>Manage your supplier accounts and incoming invoices.</p></div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={14} /> Add supplier</button>
      </div>
      <div className="toolbar">
        <div className="search-input"><Search size={14} /><input placeholder="Search suppliers…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>{filtered.length} supplier{filtered.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Supplier</th><th>Email</th><th style={{ textAlign: "right" }}>Open invoices</th><th style={{ textAlign: "right" }}>Outstanding</th><th>Last invoice</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} onClick={() => navigate(`/suppliers/${s.id}`)} style={{ cursor: "pointer" }}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "hsl(231,60%,96%)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{s.name.charAt(0)}</div>
                    <div><div style={{ fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 11, color: "var(--gray-400)" }}>{s.vatId}</div></div>
                  </div>
                </td>
                <td style={{ color: "var(--primary)" }}>{s.email}</td>
                <td style={{ textAlign: "right" }}>{s.openInvoices}</td>
                <td style={{ textAlign: "right", fontWeight: s.outstanding > 0 ? 600 : 400, color: s.outstanding > 0 ? "var(--danger)" : "var(--gray-700)" }}>{fmt(s.outstanding)}</td>
                <td className="td-muted">{fmtDate(s.lastInvoice)}</td>
                <td><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add supplier" size="md"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}><Plus size={14} /> Save supplier</button></>}>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Company name *</label><input className="form-control" placeholder="ABC Services GmbH" value={newSupplier.name} onChange={e => setNewSupplier(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">VAT ID</label><input className="form-control" placeholder="DE100200300" value={newSupplier.vatId} onChange={e => setNewSupplier(p => ({ ...p, vatId: e.target.value }))} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" value={newSupplier.email} onChange={e => setNewSupplier(p => ({ ...p, email: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={newSupplier.phone} onChange={e => setNewSupplier(p => ({ ...p, phone: e.target.value }))} /></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={newSupplier.address} onChange={e => setNewSupplier(p => ({ ...p, address: e.target.value }))} /></div>
        <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">IBAN</label><input className="form-control" placeholder="DE12 3456 7890 1234 5678 90" value={newSupplier.iban} onChange={e => setNewSupplier(p => ({ ...p, iban: e.target.value }))} /></div>
      </Modal>
    </div>
  );
}
