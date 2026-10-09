import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft, Edit2, Check, Sparkles, Building2, Calendar, CreditCard, Tag } from "lucide-react";
import { useApp, sampleReceipts } from "../context/AppContext";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function ConfidenceBadge({ score }) {
  const level = score >= 95 ? "high" : score >= 85 ? "medium" : "low";
  return (
    <div className={`confidence ${level}`} style={{ padding: "2px 8px", fontSize: 11 }}>
      <div className="confidence-bar" style={{ width: 36 }}>
        <div className="confidence-bar-fill" style={{ width: `${score}%` }} />
      </div>
      <span>{score}%</span>
    </div>
  );
}

export default function AIReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    incomingInvoices, currentScanReceipt,
    approveIncomingInvoice, addToast, t
  } = useApp();

  // Find receipt either from sample, context or incomingInvoices
  const baseReceipt = currentScanReceipt?.id === id
    ? currentScanReceipt
    : incomingInvoices.find(i => i.id === id)
    || sampleReceipts.find(s => s.id === id)
    || sampleReceipts[0];

  const conf = baseReceipt.confidence || {
    supplier: 98, invoiceNumber: 99, invoiceDate: 97, dueDate: 95,
    net: 96, vat: 98, total: 99, iban: 94
  };

  const [hoveredField, setHoveredField] = useState(null);
  const [editing, setEditing] = useState(null);
  const [approvedFields, setApprovedFields] = useState({
    supplier: true,
    invoiceNumber: true,
    invoiceDate: true,
    dueDate: true,
    net: true,
    vat: true,
    total: true,
    iban: true,
    category: true
  });

  const [fields, setFields] = useState({
    supplier: baseReceipt.supplier || "",
    invoiceNumber: baseReceipt.invoiceNumber || "",
    invoiceDate: baseReceipt.invoiceDate || "",
    dueDate: baseReceipt.dueDate || "",
    net: Number(baseReceipt.net || 0).toFixed(2),
    vat: Number(baseReceipt.vat || 0).toFixed(2),
    total: Number(baseReceipt.total || 0).toFixed(2),
    iban: baseReceipt.iban || "",
    category: baseReceipt.category || "Allgemeine Betriebsausgaben (Konto 4900)",
  });

  const categories = [
    "Telekommunikation & Internet (Konto 4920)",
    "Cloud Hosting & Server (Konto 4910)",
    "Bürobedarf & Verbrauchsmaterial (Konto 4930)",
    "Werbe- und Marketingkosten (Konto 4600)",
    "Reisekosten & Bewirtung (Konto 4670)",
    "Rechts- und Beratungskosten (Konto 4950)",
    "Allgemeine Betriebsausgaben (Konto 4900)"
  ];

  const fieldDefs = [
    { key: "supplier", label: t("Lieferantenname", "Supplier"), conf: conf.supplier, icon: Building2 },
    { key: "invoiceNumber", label: t("Rechnungsnummer", "Invoice #"), conf: conf.invoiceNumber, icon: Sparkles },
    { key: "invoiceDate", label: t("Belegdatum", "Invoice Date"), conf: conf.invoiceDate, type: "date", icon: Calendar },
    { key: "dueDate", label: t("Fälligkeitsdatum", "Due Date"), conf: conf.dueDate, type: "date", icon: Calendar },
    { key: "net", label: t("Nettobetrag", "Net Amount"), conf: conf.net, prefix: "€ ", icon: Sparkles },
    { key: "vat", label: t("MwSt. Betrag (19%)", "VAT Amount"), conf: conf.vat, prefix: "€ ", icon: Sparkles },
    { key: "total", label: t("Bruttogesamtbetrag", "Gross Total"), conf: conf.total, prefix: "€ ", icon: Sparkles },
    { key: "iban", label: t("IBAN des Lieferanten", "Supplier IBAN"), conf: conf.iban, icon: CreditCard },
  ];

  const handleApproveAndBook = () => {
    approveIncomingInvoice(baseReceipt.id, {
      supplier: fields.supplier,
      invoiceNumber: fields.invoiceNumber,
      invoiceDate: fields.invoiceDate,
      dueDate: fields.dueDate,
      net: parseFloat(fields.net) || 0,
      vat: parseFloat(fields.vat) || 0,
      total: parseFloat(fields.total) || 0,
      iban: fields.iban,
      category: fields.category,
      status: "approved"
    });
    addToast(t(`Beleg ${fields.invoiceNumber} freigegeben und als Betriebsausgabe verbucht!`, `Receipt ${fields.invoiceNumber} booked!`), "success");
    navigate("/incoming");
  };

  return (
    <div className="page-content" style={{ paddingBottom: 16 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 4, paddingLeft: 0 }} onClick={() => navigate("/incoming")}>
            <ArrowLeft size={14} /> {t("Zurück zu Belege", "Back to bills")}
          </button>
          <h1>{t("KI-Belegprüfung & Freigabe", "AI Receipt Review & Approval")}</h1>
          <p>
            {t("Extrahierte Daten von:", "Extracted information from:")} <strong>{fields.supplier}</strong> (Nr. {fields.invoiceNumber})
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigate("/incoming")}>
            {t("Abbrechen", "Cancel")}
          </button>
          <button className="btn btn-primary" onClick={handleApproveAndBook} style={{ background: "#10b981", borderColor: "#10b981" }}>
            <CheckCircle size={14} /> {t("Freigeben & Verbuchen", "Approve & Book")}
          </button>
        </div>
      </div>

      {/* Split-Screen: Originaldokument links mit interaktiven OCR Hotspots, Extrahierte Daten rechts */}
      <div className="split-wide">
        
        {/* LINKS: Dokumenten-Vorschau mit interaktiver OCR-Hervorhebung */}
        <div className="card" style={{ padding: 24, background: "#ffffff", border: "1px solid #cbd5e1", boxShadow: "var(--shadow-md)", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Originalbeleg-Scan (OCR Digitalisiert)
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, background: "#ecfdf5", color: "#10b981", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
              <Check size={12} /> 100% Text erfasst
            </span>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.6, color: "#334155" }}>
            {/* Header: Lieferant */}
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: hoveredField === "supplier" ? "#d1fae5" : "transparent",
                border: hoveredField === "supplier" ? "2px dashed #10b981" : "1px solid transparent",
                transition: "all 0.2s",
                marginBottom: 12
              }}
              onMouseEnter={() => setHoveredField("supplier")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{fields.supplier}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                {baseReceipt.docInfo?.address || "Musterstraße 12, 10115 Berlin"}<br />
                USt-IdNr.: {baseReceipt.docInfo?.taxId || "DE123456789"}
              </div>
            </div>

            {/* Metadaten: Nummer & Datum */}
            <div className="pair-grid" style={{ margin: "14px 0", padding: "10px 12px", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <div
                style={{
                  padding: "4px 6px",
                  borderRadius: 4,
                  background: hoveredField === "invoiceNumber" ? "#d1fae5" : "transparent",
                  border: hoveredField === "invoiceNumber" ? "2px dashed #10b981" : "1px solid transparent"
                }}
                onMouseEnter={() => setHoveredField("invoiceNumber")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div style={{ fontSize: 10, color: "#94a3b8" }}>Rechnungs-Nr.:</div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{fields.invoiceNumber}</div>
              </div>
              <div
                style={{
                  padding: "4px 6px",
                  borderRadius: 4,
                  background: hoveredField === "invoiceDate" ? "#d1fae5" : "transparent",
                  border: hoveredField === "invoiceDate" ? "2px dashed #10b981" : "1px solid transparent"
                }}
                onMouseEnter={() => setHoveredField("invoiceDate")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div style={{ fontSize: 10, color: "#94a3b8" }}>Belegdatum:</div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{fmtDate(fields.invoiceDate)}</div>
              </div>
            </div>

            {/* Positionen */}
            <table style={{ width: "100%", fontSize: 11, margin: "16px 0", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #cbd5e1", color: "#64748b" }}>
                  <th style={{ textAlign: "left", padding: "6px 4px" }}>Bezeichnung</th>
                  <th style={{ textAlign: "right", padding: "6px 4px" }}>Menge</th>
                  <th style={{ textAlign: "right", padding: "6px 4px" }}>Betrag</th>
                </tr>
              </thead>
              <tbody>
                {(baseReceipt.items || [{ desc: "Dienstleistungen / Ware", qty: 1, net: parseFloat(fields.net) }]).map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 4px" }}>{it.desc}</td>
                    <td style={{ textAlign: "right", padding: "8px 4px" }}>{it.qty || 1}</td>
                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{fmt(it.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summenblock */}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                background: ["net", "vat", "total"].includes(hoveredField) ? "#d1fae5" : "#f8fafc",
                border: ["net", "vat", "total"].includes(hoveredField) ? "2px dashed #10b981" : "1px solid #e2e8f0",
                transition: "all 0.2s"
              }}
              onMouseEnter={() => setHoveredField("total")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#64748b" }}>Nettobetrag:</span>
                <span style={{ fontWeight: 600 }}>{fmt(fields.net)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#64748b" }}>zzgl. 19% MwSt.:</span>
                <span style={{ fontWeight: 600 }}>{fmt(fields.vat)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #0f172a", paddingTop: 6, marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>Gesamtbetrag brutto:</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{fmt(fields.total)}</span>
              </div>
            </div>

            {/* Bankverbindung */}
            <div
              style={{
                marginTop: 16,
                padding: "8px 12px",
                borderRadius: 6,
                background: hoveredField === "iban" ? "#d1fae5" : "transparent",
                border: hoveredField === "iban" ? "2px dashed #10b981" : "1px solid transparent",
                fontSize: 10,
                color: "#64748b",
                lineHeight: 1.6
              }}
              onMouseEnter={() => setHoveredField("iban")}
              onMouseLeave={() => setHoveredField(null)}
            >
              IBAN: <strong style={{ fontFamily: "monospace" }}>{fields.iban}</strong><br />
              Zahlungsreferenz: <strong>{fields.invoiceNumber}</strong>
            </div>
          </div>
        </div>

        {/* RECHTS: KI-Extrahierte Felder zur Bestätigung & Kontierung */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          <div className="card" style={{ padding: "16px 20px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--gray-900)" }}>
                  {t("Belegdaten erfolgreich erkannt", "Document recognized by AI")}
                </div>
                <div style={{ fontSize: 11, color: "var(--gray-500)" }}>
                  {t("Bitte prüfen Sie die Felder kurz gegen den Scan links. Klicken Sie in ein Feld zum Anpassen.", "Verify fields against original document. Click to edit.")}
                </div>
              </div>
            </div>
          </div>

          {/* Buchungskonto / SKR03 Kontierung */}
          <div className="card" style={{ padding: 20 }}>
            <label className="form-label required" style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
              <Tag size={14} color="#10b981" />
              {t("Ausgabenkategorie / Buchungskonto (SKR03 / SKR04)", "Expense Category / Ledger Account")}
            </label>
            <select
              className="form-control"
              value={fields.category}
              onChange={e => setFields({ ...fields, category: e.target.value })}
              style={{ fontWeight: 600, color: "var(--gray-900)" }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Feldliste */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--gray-900)" }}>
                {t("Extrahierte Belegmerkmale", "Extracted Details")}
              </div>
              <span style={{ fontSize: 11, color: "var(--gray-400)" }}>
                {Object.values(approvedFields).filter(Boolean).length}/{fieldDefs.length} {t("verifiziert", "verified")}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fieldDefs.map(fd => {
                const isHovered = hoveredField === fd.key;
                const isEditing = editing === fd.key;

                return (
                  <div
                    key={fd.key}
                    className="extract-row"
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: isHovered ? "1px solid #10b981" : "1px solid var(--gray-200)",
                      background: isHovered ? "#f0fdf4" : "var(--gray-50)",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={() => setHoveredField(fd.key)}
                    onMouseLeave={() => setHoveredField(null)}
                  >
                    <div className="extract-label">
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-600)" }}>{fd.label}</div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {isEditing ? (
                        <input
                          className="form-control"
                          style={{ padding: "4px 8px", fontSize: 12 }}
                          type={fd.type || "text"}
                          value={fields[fd.key]}
                          autoFocus
                          onChange={e => setFields({ ...fields, [fd.key]: e.target.value })}
                          onBlur={() => setEditing(null)}
                          onKeyDown={e => e.key === "Enter" && setEditing(null)}
                        />
                      ) : (
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "var(--gray-900)",
                            cursor: "pointer",
                            padding: "2px 4px",
                            borderRadius: 4
                          }}
                          onClick={() => setEditing(fd.key)}
                          title="Klicken zum Bearbeiten"
                        >
                          {fd.prefix || ""}{fields[fd.key] || "—"}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {fd.conf && <ConfidenceBadge score={fd.conf} />}
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 4, color: isEditing ? "var(--primary)" : "var(--gray-400)" }}
                        onClick={() => setEditing(isEditing ? null : fd.key)}
                        title="Bearbeiten"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--gray-200)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => navigate("/incoming")}>
                {t("Später fortsetzen", "Review later")}
              </button>
              <button className="btn btn-primary" onClick={handleApproveAndBook} style={{ background: "#10b981", borderColor: "#10b981" }}>
                <CheckCircle size={14} /> {t("Beleg jetzt freigeben & verbuchen", "Approve & Book Now")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
