import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { customers, invoices } from "../data/mockData";

function fmt(n) { return "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2 }); }
function fmtDate(d) { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${y}`; }

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const customer = customers.find(c => c.id === id);
  const customerInvoices = invoices.filter(i => i.customerId === id);

  if (!customer) return <div className="page-content"><div className="empty-state"><div className="empty-title">Customer not found</div><button className="btn btn-primary" onClick={() => navigate("/customers")}>Back</button></div></div>;

  const totalBilled = customerInvoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = customerInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="page-content">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate("/customers")}><ArrowLeft size={14} /> Back to customers</button>
      <div className="detail-header">
        <div className="detail-head">
          <div className="detail-identity">
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 }}>{customer.name.charAt(0)}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div className="detail-title">{customer.name}</div>
                <StatusBadge status={customer.status} />
              </div>
              <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{customer.address} · {customer.email}</div>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-primary" onClick={() => navigate("/invoices/create")}><Plus size={14} /> Create invoice</button>
          </div>
        </div>
        <div className="stats-row" style={{ paddingLeft: 0, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--gray-100)", borderBottom: "none", paddingBottom: 0 }}>
          {[["Total billed", fmt(totalBilled)], ["Total paid", fmt(totalPaid)], ["Outstanding", fmt(customer.outstanding)], ["Invoices", customerInvoices.length]].map(([l, v]) => (
            <div key={l} className="stat"><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {["overview", "invoices", "activity"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="split-equal">
          <div className="card">
            <div className="card-header"><h2>Company information</h2></div>
            <div className="card-body">
              {[["Company name", customer.name], ["VAT ID", customer.vatId], ["Contact person", customer.contactPerson], ["Email", customer.email], ["Phone", customer.phone], ["Country", customer.country]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--gray-100)", fontSize: 13 }}>
                  <span style={{ color: "var(--gray-500)" }}>{l}</span>
                  <span style={{ fontWeight: 500 }}>{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2>Billing address</h2></div>
            <div className="card-body">
              <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--gray-700)" }}>{customer.address}<br />{customer.country}</div>
            </div>
          </div>
        </div>
      )}

      {tab === "invoices" && (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Invoice</th><th>Date</th><th>Due</th><th style={{ textAlign: "right" }}>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {customerInvoices.map(inv => (
                <tr key={inv.id} onClick={() => navigate(`/invoices/${inv.id}`)} style={{ cursor: "pointer" }}>
                  <td><span style={{ fontWeight: 600, color: "var(--primary)" }}>{inv.number}</span></td>
                  <td className="td-muted">{fmtDate(inv.issueDate)}</td>
                  <td className="td-muted">{fmtDate(inv.dueDate)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(inv.amount)}</td>
                  <td><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "activity" && (
        <div className="card"><div className="card-body">
          {["Invoice INV-2026-0142 created", "Invoice INV-2026-0138 paid", "Invoice INV-2026-0133 sent"].map((a, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--gray-100)", fontSize: 13, color: "var(--gray-600)" }}>
              <FileText size={13} style={{ marginRight: 8, color: "var(--gray-400)", display: "inline" }} />{a}
            </div>
          ))}
        </div></div>
      )}
    </div>
  );
}
