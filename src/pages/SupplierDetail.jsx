import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { suppliers, incomingInvoices } from "../data/mockData";

function fmt(n) { return "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2 }); }
function fmtDate(d) { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${y}`; }

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const supplier = suppliers.find(s => s.id === id);
  const supplierInvoices = incomingInvoices.filter(i => i.supplierId === id);

  if (!supplier) return <div className="page-content"><div className="empty-state"><div className="empty-title">Supplier not found</div><button className="btn btn-primary" onClick={() => navigate("/suppliers")}>Back</button></div></div>;

  return (
    <div className="page-content">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate("/suppliers")}><ArrowLeft size={14} /> Back to suppliers</button>
      <div className="detail-header">
        <div className="detail-head">
          <div className="detail-identity">
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }}>{supplier.name.charAt(0)}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div className="detail-title">{supplier.name}</div>
                <StatusBadge status={supplier.status} />
              </div>
              <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{supplier.address} · {supplier.email}</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/incoming")}><Upload size={14} /> Upload invoice</button>
        </div>
        <div className="stats-row" style={{ paddingLeft: 0, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--gray-100)", borderBottom: "none", paddingBottom: 0 }}>
          {[["Open invoices", supplier.openInvoices], ["Outstanding", supplier.outstanding > 0 ? fmt(supplier.outstanding) : "—"], ["Last invoice", fmtDate(supplier.lastInvoice)]].map(([l, v]) => (
            <div key={l} className="stat"><div className="stat-value" style={{ fontSize: 15 }}>{v}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {["overview", "invoices", "activity"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="card">
          <div className="card-header"><h2>Supplier information</h2></div>
          <div className="card-body">
            {[["Company name", supplier.name], ["VAT ID", supplier.vatId], ["Email", supplier.email], ["Phone", supplier.phone], ["Address", supplier.address], ["IBAN", supplier.iban], ["Country", supplier.country]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--gray-100)", fontSize: 13 }}>
                <span style={{ color: "var(--gray-500)" }}>{l}</span>
                <span style={{ fontWeight: 500 }}>{v || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "invoices" && (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Invoice no.</th><th>Date</th><th>Due</th><th style={{ textAlign: "right" }}>Total</th><th>Status</th></tr></thead>
            <tbody>
              {supplierInvoices.map(inv => (
                <tr key={inv.id} onClick={() => navigate(`/incoming/${inv.id}`)} style={{ cursor: "pointer" }}>
                  <td><span style={{ fontWeight: 600, color: "var(--primary)" }}>{inv.invoiceNumber}</span></td>
                  <td className="td-muted">{fmtDate(inv.invoiceDate)}</td>
                  <td className="td-muted">{fmtDate(inv.dueDate)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(inv.total)}</td>
                  <td><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "activity" && (
        <div className="card"><div className="card-body" style={{ color: "var(--gray-500)", fontSize: 13 }}>No recent activity.</div></div>
      )}
    </div>
  );
}
