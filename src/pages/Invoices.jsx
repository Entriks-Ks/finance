import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Edit2, Copy, Download, Send, CheckCircle, Trash2, MoreVertical, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function ActionMenu({ inv, onMarkPaid, onDelete, onNavigate, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)} style={{ padding: "4px 8px" }}>
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="dropdown-menu" style={{ right: 0, zIndex: 100 }}>
          <button className="dropdown-item" onClick={() => { onNavigate(`/invoices/${inv.id}`); setOpen(false); }}>
            <Eye size={13} /> {t("Ansehen & Drucken", "View & Print")}
          </button>
          <button className="dropdown-item" onClick={() => { onNavigate(`/invoices/${inv.id}/edit`); setOpen(false); }}>
            <Edit2 size={13} /> {t("Bearbeiten", "Edit")}
          </button>
          <button className="dropdown-item" onClick={() => { window.print(); setOpen(false); }}>
            <Download size={13} /> {t("PDF herunterladen", "Download PDF")}
          </button>
          <div className="dropdown-divider" />
          {inv.status !== "paid" && (
            <button className="dropdown-item" onClick={() => { onMarkPaid(inv.id); setOpen(false); }}>
              <CheckCircle size={13} color="#10b981" /> {t("Als bezahlt markieren", "Mark as paid")}
            </button>
          )}
          <button className="dropdown-item danger" onClick={() => { onDelete(inv.id); setOpen(false); }}>
            <Trash2 size={13} /> {t("Löschen", "Delete")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Invoices() {
  const navigate = useNavigate();
  const { invoices, markInvoicePaid, deleteInvoice, addToast, t } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = !q || inv.number.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchCustomer = customerFilter === "all" || inv.customerName === customerFilter;
    return matchSearch && matchStatus && matchCustomer;
  });

  const handleMarkPaid = (id) => {
    markInvoicePaid(id);
    addToast(t("Rechnung als bezahlt verbucht.", "Invoice marked as paid."), "success");
  };

  const customers = [...new Set(invoices.map(i => i.customerName))];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{t("Ausgangsrechnungen", "Invoices")}</h1>
          <p>{t("Erstellen, versenden und überwachen Sie Kundenrechnungen nach GoBD-Standard.", "Create, send and track customer invoices.")}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => navigate("/invoices/create")}>
            <Plus size={14} /> {t("Rechnung schreiben", "Create invoice")}
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-input">
          <Search size={14} />
          <input
            placeholder={t("Rechnungsnummer oder Kunde suchen…", "Search by number or customer…")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">{t("Alle Status", "All statuses")}</option>
          <option value="draft">{t("Entwurf", "Draft")}</option>
          <option value="open">{t("Offen", "Open")}</option>
          <option value="sent">{t("Versendet", "Sent")}</option>
          <option value="paid">{t("Bezahlt", "Paid")}</option>
          <option value="overdue">{t("Überfällig", "Overdue")}</option>
        </select>
        <select className="filter-select" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}>
          <option value="all">{t("Alle Kunden", "All customers")}</option>
          {customers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>
          {filtered.length} {t("Rechnung(en)", "invoice(s)")}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={40} />
            <div className="empty-title">{t("Keine Rechnungen gefunden", "No invoices found")}</div>
            <div className="empty-sub">{t("Erstellen Sie Ihre erste Kundenrechnung mit wenigen Klicks.", "Create your first customer invoice.")}</div>
            <button className="btn btn-primary" onClick={() => navigate("/invoices/create")}>
              <Plus size={14} /> {t("Rechnung schreiben", "Create invoice")}
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>{t("Rechnungs-Nr.", "Invoice #")}</th>
                <th>{t("Kunde", "Customer")}</th>
                <th>{t("Rechnungsdatum", "Issue Date")}</th>
                <th>{t("Fälligkeit", "Due Date")}</th>
                <th>{t("Netto", "Net")}</th>
                <th>{t("MwSt.", "VAT")}</th>
                <th>{t("Gesamt brutto", "Total")}</th>
                <th>{t("Status", "Status")}</th>
                <th style={{ textAlign: "right" }}>{t("Aktionen", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span
                      style={{ fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}
                      onClick={() => navigate(`/invoices/${inv.id}`)}
                    >
                      {inv.number}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>{inv.customerName}</div>
                  </td>
                  <td>{fmtDate(inv.issueDate)}</td>
                  <td>{fmtDate(inv.dueDate)}</td>
                  <td>{fmt(inv.netAmount || (inv.amount / 1.19))}</td>
                  <td style={{ color: "var(--gray-500)" }}>{fmt(inv.vatAmount || (inv.amount - (inv.amount / 1.19)))}</td>
                  <td>
                    <span className="amount-cell">{fmt(inv.amount)}</span>
                  </td>
                  <td>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px" }}
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                        title={t("Details ansehen", "View details")}
                      >
                        <Eye size={13} />
                      </button>
                      {inv.status !== "paid" && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px", color: "#10b981", borderColor: "#a7f3d0" }}
                          onClick={() => handleMarkPaid(inv.id)}
                          title={t("Als bezahlt verbuchen", "Mark as paid")}
                        >
                          <CheckCircle size={13} />
                        </button>
                      )}
                      <ActionMenu
                        inv={inv}
                        onMarkPaid={handleMarkPaid}
                        onDelete={deleteInvoice}
                        onNavigate={navigate}
                        t={t}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
