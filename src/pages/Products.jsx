import { useState } from "react";
import { Plus, Search, Edit2, Copy, Archive, Package } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { useApp } from "../context/AppContext";
import { products as mockProducts } from "../data/mockData";

function fmt(n) { return "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2 }); }

export default function Products() {
  const { addToast } = useApp();
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", type: "service", description: "", price: "", unit: "project", vat: 19 });

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: "", type: "service", description: "", price: "", unit: "project", vat: 19 });
    setShowAddModal(true);
  };
  const openEdit = (p) => {
    setEditingProduct(p);
    setForm({ name: p.name, type: p.type, description: p.description, price: p.price, unit: p.unit, vat: p.vat });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!form.name) { addToast("Please enter a name.", "error"); return; }
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...form, price: parseFloat(form.price) || 0 } : p));
      addToast("Product updated.", "success");
    } else {
      setProducts(prev => [...prev, { ...form, id: "p" + Date.now(), price: parseFloat(form.price) || 0, status: "active" }]);
      addToast("Product added.", "success");
    }
    setShowAddModal(false);
  };

  const handleArchive = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "archived" ? "active" : "archived" } : p));
    addToast("Product status updated.", "info");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h1>Products &amp; Services</h1><p>Your catalog of billable products and services.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> Add product</button>
      </div>
      <div className="toolbar">
        <div className="search-input"><Search size={14} /><input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
      </div>
      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-icon"><Package size={24} /></div>
          <div className="empty-title">No products yet</div>
          <div className="empty-sub">Add products or services to use them in your invoices.</div>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> Add product</button>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Unit</th><th style={{ textAlign: "right" }}>Price</th><th style={{ textAlign: "right" }}>VAT</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span style={{ fontWeight: 600 }}>{p.name}</span></td>
                  <td><span style={{ fontSize: 11, color: "var(--gray-500)", background: "var(--gray-100)", padding: "2px 8px", borderRadius: 4, textTransform: "capitalize" }}>{p.type}</span></td>
                  <td style={{ fontSize: 12, color: "var(--gray-400)", maxWidth: 200 }}>{p.description}</td>
                  <td className="td-muted">{p.unit}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(p.price)}</td>
                  <td style={{ textAlign: "right" }}>{p.vat}%</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Edit"><Edit2 size={12} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setProducts(prev => [...prev, { ...p, id: "p" + Date.now(), name: p.name + " (copy)" }]); addToast("Duplicated.", "info"); }} title="Duplicate"><Copy size={12} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleArchive(p.id)} title="Archive/Restore"><Archive size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={editingProduct ? "Edit product" : "Add product"} size="md"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editingProduct ? "Save changes" : <><Plus size={14} /> Add product</>}</button></>}>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Name *</label><input className="form-control" placeholder="e.g. Website Development" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              <option value="service">Service</option><option value="product">Product</option>
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">Description</label><input className="form-control" placeholder="Brief description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
        <div className="form-row-3">
          <div className="form-group"><label className="form-label">Price (€)</label><input className="form-control" type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Unit</label>
            <select className="form-select" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
              <option value="project">Project</option><option value="hour">Hour</option><option value="day">Day</option><option value="month">Month</option><option value="piece">Piece</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">VAT %</label>
            <select className="form-select" value={form.vat} onChange={e => setForm(p => ({ ...p, vat: parseInt(e.target.value) }))}>
              <option value={0}>0%</option><option value={7}>7%</option><option value={19}>19%</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
