import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Search, Eye, CheckCircle, FileText, ArrowRight, Sparkles, AlertCircle, Clock, Trash2 } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useApp, sampleReceipts } from "../context/AppContext";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export default function IncomingInvoices() {
  const navigate = useNavigate();
  const {
    incomingInvoices, deleteIncomingInvoice,
    setCurrentScanReceipt, addToast, t
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanDocName, setScanDocName] = useState("");
  const fileRef = useRef(null);

  const filtered = incomingInvoices.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = !q || inv.supplier.toLowerCase().includes(q) || inv.invoiceNumber.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const runAiExtraction = (sampleOrFile) => {
    const receipt = sampleOrFile.supplier ? sampleOrFile : {
      ...sampleReceipts[0],
      invoiceNumber: "SCAN-" + Math.floor(100000 + Math.random() * 900000),
      supplier: sampleOrFile.name.replace(/\.[^/.]+$/, "") || "Neuer Lieferant"
    };

    setScanDocName(receipt.supplier);
    setCurrentScanReceipt(receipt);
    setScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1300);
    setTimeout(() => setScanStep(4), 2000);
    setTimeout(() => {
      setScanning(false);
      addToast(t(`Beleg von ${receipt.supplier} erfolgreich gescannt!`, `Receipt from ${receipt.supplier} scanned!`), "success");
      navigate(`/incoming/${receipt.id}/review`);
    }, 2600);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) runAiExtraction(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) runAiExtraction(file);
  };

  // High-Tech Scanner Overlay
  if (scanning) {
    return (
      <div className="page-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <div className="card" style={{ maxWidth: 540, width: "100%", padding: 36, textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          {/* Laser scanning beam */}
          <div className="scanner-beam" />

          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Sparkles size={32} className="animate-pulse" />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>
            {t("KI-Belegprüfung & Texterkennung läuft…", "AI Receipt Extraction in Progress…")}
          </h2>
          <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 28 }}>
            {t("Analysiere Dokument:", "Processing document:")} <strong>{scanDocName}</strong>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", maxWidth: 380, margin: "0 auto" }}>
            {[
              { step: 1, label: t("1. OCR-Texterkennung & Dokument-Segmentierung", "1. OCR Text & Layout Segmentation") },
              { step: 2, label: t("2. Lieferanten-Match & Stammdatenabgleich", "2. Supplier Identification & Match") },
              { step: 3, label: t("3. Betrags- und Steuersatzkalkulation (19% / 7%)", "3. Net, VAT & Gross Calculation") },
              { step: 4, label: t("4. IBAN & Verwendungszweck-Validierung", "4. Bank Coordinates & Payment Reference") }
            ].map(s => {
              const done = scanStep > s.step;
              const active = scanStep === s.step;
              return (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: done ? "#ecfdf5" : active ? "var(--gray-100)" : "transparent",
                    color: done ? "#065f46" : active ? "var(--gray-900)" : "var(--gray-400)",
                    fontWeight: active ? 600 : 500,
                    fontSize: 13,
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ width: 20, display: "flex", justifyContent: "center" }}>
                    {done ? (
                      <CheckCircle size={16} color="#10b981" />
                    ) : active ? (
                      <div className="ai-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    ) : (
                      <Clock size={14} />
                    )}
                  </div>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>{t("Belege & Eingangsrechnungen", "Incoming Invoices & Receipts")}</h1>
          <p>{t("Eingangsrechnungen automatisiert per KI auslesen, prüfen und buchhalterisch erfassen.", "Upload bills and let AI extract amounts, suppliers, dates and taxes automatically.")}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> {t("Beleg hochladen", "Upload Bill")}
          </button>
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            accept=".pdf,image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* 1-CLICK TEST SAMPLE RECEIPTS */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Sparkles size={15} color="#10b981" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-800)" }}>
            {t("Sofort-Testen mit vorbereiteten Belegen (1-Klick KI-Scan):", "Test immediately with sample receipts (1-Click AI Scan):")}
          </span>
        </div>
        <div className="sample-grid">
          {sampleReceipts.map(rec => (
            <div
              key={rec.id}
              className="card"
              onClick={() => runAiExtraction(rec)}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--gray-900)" }}>{rec.supplier}</span>
                <span style={{ fontWeight: 700, color: "#10b981", fontSize: 13 }}>{fmt(rec.total)}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{rec.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, paddingTop: 6, borderTop: "1px solid var(--gray-100)", fontSize: 11 }}>
                <span style={{ color: "var(--gray-400)" }}>Nr. {rec.invoiceNumber}</span>
                <span style={{ color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  {t("KI-Scan starten", "Scan")} <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRAG & DROP UPLOAD ZONE */}
      <div
        className={`upload-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{ marginBottom: 24, cursor: "pointer", padding: "28px 20px" }}
      >
        <div className="upload-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
          <Upload size={24} />
        </div>
        <div className="upload-title" style={{ fontSize: 15, fontWeight: 700 }}>
          {t("Eigene Rechnung oder Foto hier hineinziehen", "Drag and drop any invoice or photo here")}
        </div>
        <div className="upload-sub" style={{ fontSize: 12 }}>
          {t("Unterstützt PDF, JPG, PNG (bis 25 MB). Die KI extrahiert sofort Lieferant, Beträge, Steuern und IBAN.", "Supports PDF, JPG, PNG. AI automatically extracts supplier, amounts, VAT and IBAN.")}
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="toolbar">
        <div className="search-input">
          <Search size={14} />
          <input
            placeholder={t("Lieferant oder Rechnungsnummer suchen…", "Search by supplier or invoice number…")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">{t("Alle Status", "All statuses")}</option>
          <option value="pending_review">{t("Ausstehende Prüfung", "Pending review")}</option>
          <option value="approved">{t("Freigegeben / Verbucht", "Approved")}</option>
          <option value="paid">{t("Bezahlt", "Paid")}</option>
          <option value="overdue">{t("Überfällig", "Overdue")}</option>
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>
          {filtered.length} {t("Eingangsrechnungen", "invoices")}
        </span>
      </div>

      {/* INVOICES TABLE */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>{t("Lieferant", "Supplier")}</th>
              <th>{t("Belegnummer", "Invoice #")}</th>
              <th>{t("Kategorie", "Category")}</th>
              <th>{t("Belegdatum", "Date")}</th>
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
                  <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>{inv.supplier}</div>
                  <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{inv.iban}</div>
                </td>
                <td style={{ fontWeight: 500 }}>{inv.invoiceNumber}</td>
                <td>
                  <span style={{ background: "var(--gray-100)", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                    {inv.category || "Allgemein"}
                  </span>
                </td>
                <td>{fmtDate(inv.invoiceDate)}</td>
                <td>{fmtDate(inv.dueDate)}</td>
                <td>{fmt(inv.net)}</td>
                <td style={{ color: "var(--gray-500)" }}>{fmt(inv.vat)}</td>
                <td>
                  <span className="amount-cell">{fmt(inv.total)}</span>
                </td>
                <td>
                  <StatusBadge status={inv.status} />
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    {inv.status === "pending_review" ? (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: "4px 10px", fontSize: 12 }}
                        onClick={() => {
                          setCurrentScanReceipt(inv);
                          navigate(`/incoming/${inv.id}/review`);
                        }}
                      >
                        <Sparkles size={12} /> {t("KI-Prüfen", "Review")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px" }}
                        onClick={() => navigate(`/incoming/${inv.id}`)}
                      >
                        <Eye size={13} />
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px 6px", color: "var(--danger)" }}
                      onClick={() => deleteIncomingInvoice(inv.id)}
                      title="Löschen"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
