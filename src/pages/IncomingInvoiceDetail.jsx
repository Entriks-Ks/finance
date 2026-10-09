import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, Edit2, Trash2, Eye, FileText, Sparkles, CreditCard } from "lucide-react";
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

export default function IncomingInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incomingInvoices, approveIncomingInvoice, deleteIncomingInvoice, addToast, t } = useApp();

  const inv = incomingInvoices.find(i => i.id === id);

  if (!inv) {
    return (
      <div className="page-content">
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div className="empty-state">
            <FileText size={40} color="var(--gray-400)" />
            <div className="empty-title">{t("Beleg nicht gefunden", "Invoice not found")}</div>
            <button className="btn btn-primary" onClick={() => navigate("/incoming")}>
              {t("Zurück zur Belegübersicht", "Back to incoming invoices")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkPaid = () => {
    approveIncomingInvoice(inv.id, { status: "paid", paidDate: new Date().toISOString().split("T")[0] });
    addToast(t("Beleg als bezahlt verbucht.", "Marked as paid."), "success");
  };

  const handleDelete = () => {
    deleteIncomingInvoice(inv.id);
    navigate("/incoming");
  };

  return (
    <div className="page-content">
      <div className="action-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/incoming")} style={{ paddingLeft: 0 }}>
          <ArrowLeft size={14} /> {t("Zurück zu Belege", "Back to bills")}
        </button>

        <div className="action-bar-btns">
          {inv.status === "pending_review" && (
            <button className="btn btn-primary" onClick={() => navigate(`/incoming/${id}/review`)} style={{ background: "#00b67a", borderColor: "#00b67a" }}>
              <Sparkles size={13} /> {t("KI-Prüfung öffnen", "Review with AI")}
            </button>
          )}
          {inv.status === "approved" && (
            <button className="btn btn-primary" onClick={handleMarkPaid} style={{ background: "#00b67a", borderColor: "#00b67a" }}>
              <CheckCircle size={13} /> {t("Als bezahlt markieren", "Mark as paid")}
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Download size={13} /> {t("Drucken / PDF", "Download")}
          </button>
          <button className="btn btn-ghost" style={{ color: "var(--danger)" }} onClick={handleDelete} title="Löschen">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="split">
        {/* LINKS: Details & Kontierung */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--gray-900)" }}>{inv.supplier}</div>
              <div style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 2 }}>Beleg-Nr.: {inv.invoiceNumber}</div>
            </div>
            <StatusBadge status={inv.status} />
          </div>

          <div className="pair-grid" style={{ marginBottom: 24 }}>
            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "var(--gray-400)", textTransform: "uppercase", fontWeight: 700 }}>Belegdatum</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-800)", marginTop: 4 }}>{fmtDate(inv.invoiceDate)}</div>
            </div>
            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "var(--gray-400)", textTransform: "uppercase", fontWeight: 700 }}>Fälligkeitsdatum</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-800)", marginTop: 4 }}>{fmtDate(inv.dueDate)}</div>
            </div>
          </div>

          <div className="table-scroll" style={{ marginBottom: 20 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Posten / Buchung</th>
                <th style={{ textAlign: "right" }}>Nettobetrag</th>
                <th style={{ textAlign: "right" }}>MwSt. (19%)</th>
                <th style={{ textAlign: "right" }}>Bruttogesamt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>{inv.category || "Eingangsleistung / Betriebsausgabe"}</td>
                <td style={{ textAlign: "right" }}>{fmt(inv.net)}</td>
                <td style={{ textAlign: "right", color: "var(--gray-500)" }}>{fmt(inv.vat)}</td>
                <td style={{ textAlign: "right", fontWeight: 700, fontSize: 14 }}>{fmt(inv.total)}</td>
              </tr>
            </tbody>
          </table>
          </div>

          <div style={{ padding: 14, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, color: "var(--gray-600)", lineHeight: 1.7, overflowWrap: "anywhere" }}>
            <strong>Bankverbindung des Lieferanten:</strong><br />
            IBAN: <strong style={{ fontFamily: "monospace" }}>{inv.iban}</strong><br />
            Verwendungszweck: <strong>{inv.reference || inv.invoiceNumber}</strong>
          </div>
        </div>

        {/* RECHTS: Buchhaltungs-Check */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", marginBottom: 8 }}>
              Rechnungsbetrag
            </h3>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--gray-900)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              {fmt(inv.total)}
            </div>
            <div style={{ fontSize: 12, color: "var(--gray-500)", marginBottom: 16 }}>
              Enthält {fmt(inv.vat)} abziehbare Vorsteuer (USt-Abzug)
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#ecfdf5", color: "#065f46", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
              <CheckCircle size={14} color="#10b981" /> GoBD-konform digital archiviert
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
