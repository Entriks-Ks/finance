import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Search, X, Download, Send, ArrowLeft, Eye, FileText, Check } from "lucide-react";
import Modal from "../components/Modal";
import GiroCode from "../components/GiroCode";
import { useApp } from "../context/AppContext";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtD(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

const today = new Date().toISOString().split("T")[0];
const due14 = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

function InvoiceDocPreview({ customer, items, invoiceNumber, issueDate, dueDate, notes, paymentTerms, settings, t }) {
  const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const vatByRate = {};
  items.forEach(i => {
    const net = (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0);
    const rate = Number(i.vat) || 0;
    vatByRate[rate] = (vatByRate[rate] || 0) + net * rate / 100;
  });
  const vatTotal = Object.values(vatByRate).reduce((s, v) => s + v, 0);
  const total = subtotal + vatTotal;

  return (
    <div className="invoice-doc" id="printable-invoice">
      {/* DIN 5008 Absenderzeile im Sichtfenster */}
      <div style={{ fontSize: 9, color: "var(--gray-400)", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 16 }}>
        {settings.name} • {settings.address}
      </div>

      <div className="invoice-doc-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="invoice-company-name" style={{ fontSize: 18, color: "var(--gray-900)" }}>{settings.name}</div>
          <div className="invoice-company-addr" style={{ fontSize: 11, color: "var(--gray-500)", lineHeight: 1.6 }}>
            {settings.address}<br />
            Steuernummer: {settings.taxNumber} | USt-IdNr.: {settings.vatId}<br />
            E-Mail: {settings.email}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <img src="/logo.svg" alt={settings.name} style={{ width: 56, height: 56, display: "block", marginLeft: "auto" }} />
        </div>
      </div>

      <div className="invoice-parties" style={{ marginBottom: 24 }}>
        <div>
          <div className="invoice-party-label" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--gray-400)", marginBottom: 4 }}>
            {t("Rechnungsempfänger", "Bill To")}
          </div>
          {customer ? (
            <div>
              <div className="invoice-party-name" style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>{customer.name}</div>
              <div className="invoice-party-addr" style={{ fontSize: 12, color: "var(--gray-600)", lineHeight: 1.6 }}>
                {customer.contactPerson && <span>z. Hd. {customer.contactPerson}<br /></span>}
                {customer.address}<br />
                {customer.country}
                {customer.vatId && <><br />USt-IdNr.: {customer.vatId}</>}
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--gray-400)", fontStyle: "italic", fontSize: 13 }}>
              {t("← Bitte links einen Kunden auswählen", "← Please select a customer on the left")}
            </div>
          )}
        </div>
        <div>
          <table className="invoice-meta-table">
            <tbody>
              <tr><td>{t("Rechnungsnummer", "Invoice number")}</td><td style={{ fontWeight: 700 }}>{invoiceNumber}</td></tr>
              <tr><td>{t("Rechnungsdatum", "Invoice date")}</td><td>{fmtD(issueDate)}</td></tr>
              <tr><td>{t("Fälligkeitsdatum", "Due date")}</td><td style={{ fontWeight: 600, color: "var(--gray-900)" }}>{fmtD(dueDate)}</td></tr>
              <tr><td>{t("Zahlungsziel", "Payment terms")}</td><td>{paymentTerms}</td></tr>
              <tr><td>{t("Leistungsdatum", "Delivery date")}</td><td>{fmtD(issueDate)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="invoice-doc-title" style={{ fontSize: 20, fontWeight: 800, color: "var(--gray-900)", marginBottom: 12, letterSpacing: -0.5 }}>
        {t("Rechnung", "Invoice")}
      </div>

      <table className="invoice-items-table" style={{ marginBottom: 16 }}>
        <thead>
          <tr>
            <th style={{ width: "6%" }}>Pos.</th>
            <th>{t("Bezeichnung", "Description")}</th>
            <th style={{ textAlign: "right", width: "14%" }}>{t("Menge", "Qty")}</th>
            <th style={{ textAlign: "right", width: "16%" }}>{t("Einzelpreis (netto)", "Unit price")}</th>
            <th style={{ textAlign: "right", width: "10%" }}>{t("MwSt.", "VAT")}</th>
            <th style={{ textAlign: "right", width: "16%" }}>{t("Gesamt (netto)", "Total")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const net = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
            return (
              <tr key={i}>
                <td style={{ color: "var(--gray-400)" }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{item.description || "—"}</td>
                <td style={{ textAlign: "right" }}>{item.qty} {item.unit || "x"}</td>
                <td style={{ textAlign: "right" }}>{fmt(item.price || 0)}</td>
                <td style={{ textAlign: "right" }}>{item.vat || 19}%</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(net)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summenblock */}
      <div className="invoice-totals">
        <div className="invoice-totals-inner">
          <div className="invoice-total-row">
            <span className="invoice-total-label">{t("Nettobetrag", "Net subtotal")}</span>
            <span>{fmt(subtotal)}</span>
          </div>
          {Object.keys(vatByRate).sort((a, b) => Number(a) - Number(b)).map(rate => (
            <div className="invoice-total-row" key={rate}>
              <span className="invoice-total-label">{t("zzgl.", "plus")} {rate}% {t("MwSt.", "VAT")}</span>
              <span>{fmt(vatByRate[rate])}</span>
            </div>
          ))}
          <div className="invoice-total-row grand" style={{ borderTop: "2px solid #0f172a", marginTop: 6, paddingTop: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>{t("Gesamtbetrag (brutto)", "Total amount")}</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Zahlungsdetails & GiroCode Block */}
      <div className="pay-block">
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>
            {t("Zahlungsinformationen", "Payment information")}
          </div>
          <div style={{ fontSize: 11, color: "var(--gray-600)", lineHeight: 1.7 }}>
            Bitte überweisen Sie den Gesamtbetrag von <strong>{fmt(total)}</strong> bis zum <strong>{fmtD(dueDate)}</strong> auf unser Bankkonto:<br />
            Bank: <strong>{settings.bank}</strong><br />
            IBAN: <strong style={{ fontFamily: "monospace" }}>{settings.iban}</strong><br />
            BIC: <strong style={{ fontFamily: "monospace" }}>{settings.bic}</strong><br />
            Verwendungszweck: <strong>{invoiceNumber}</strong>
          </div>
        </div>
        <GiroCode
          name={settings.name}
          iban={settings.iban}
          bic={settings.bic}
          amount={total}
          reference={invoiceNumber}
          hint={t("Mit Banking-App scannen", "Scan with your banking app")}
        />
      </div>

      {notes && (
        <div style={{ fontSize: 11, color: "var(--gray-600)", marginTop: 14, padding: "8px 12px", background: "#f1f5f9", borderRadius: 6 }}>
          <strong>{t("Hinweis", "Note")}:</strong> {notes}
        </div>
      )}

      <div className="invoice-footer" style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #e2e8f0", fontSize: 10, color: "var(--gray-400)", textAlign: "center" }}>
        Vielen Dank für die gute Zusammenarbeit! • {settings.name} • Sitz der Gesellschaft: Berlin • USt-IdNr.: {settings.vatId}
      </div>
    </div>
  );
}

export default function CreateInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    customers, products, settings,
    invoices, createInvoice, updateInvoice,
    addCustomer, addToast, t
  } = useApp();

  const existingInv = id ? invoices.find(i => i.id === id) : null;

  const [selectedCustomer, setSelectedCustomer] = useState(
    existingInv ? customers.find(c => c.id === existingInv.customerId) || null : null
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDD, setShowCustomerDD] = useState(false);
  const [newCustomerModal, setNewCustomerModal] = useState(false);
  const [newCustForm, setNewCustForm] = useState({ name: "", email: "", address: "", vatId: "" });

  const [invoiceNumber] = useState(
    existingInv ? existingInv.number : `INV-2026-0${settings.nextInvoiceNumber || 143}`
  );
  const [issueDate, setIssueDate] = useState(existingInv?.issueDate || today);
  const [paymentTermsDays, setPaymentTermsDays] = useState(14);
  const [dueDate, setDueDate] = useState(existingInv?.dueDate || due14);
  const [notes, setNotes] = useState(existingInv?.notes || "");
  const [items, setItems] = useState(
    existingInv?.items?.length ? existingInv.items : [
      { description: "Website Development & Consulting", qty: 1, price: 1500, vat: 19, unit: "Pauschale" }
    ]
  );

  // Email Send Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Rechnung ${invoiceNumber} von ${settings.name}`);
  const [emailRecipient, setEmailRecipient] = useState("");

  useEffect(() => {
    if (selectedCustomer) {
      setEmailRecipient(selectedCustomer.email || "");
    }
  }, [selectedCustomer]);

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0);
  const vatTotal = items.reduce((s, i) => {
    const net = (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0);
    return s + net * (parseFloat(i.vat) || 19) / 100;
  }, 0);
  const total = subtotal + vatTotal;

  const handleTermsChange = (days) => {
    setPaymentTermsDays(days);
    const d = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
    setDueDate(d);
  };

  const updateItem = (idx, field, val) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };

  const addItem = () => {
    setItems(prev => [...prev, { description: "", qty: 1, price: 0, vat: 19, unit: "Std." }]);
  };

  const removeItem = (idx) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSelectProduct = (idx, prodId) => {
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setItems(prev => prev.map((it, i) => i === idx ? {
        ...it,
        description: prod.name + " (" + prod.description + ")",
        price: prod.price,
        vat: prod.vat,
        unit: prod.unit
      } : it));
    }
  };

  const handleSaveInvoice = (status = "open", customMessage = null) => {
    if (!selectedCustomer) {
      addToast(t("Bitte wählen Sie zuerst einen Kunden aus.", "Please select a customer first."), "error");
      return;
    }

    const invData = {
      id: existingInv ? existingInv.id : "inv-" + Date.now(),
      number: invoiceNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      issueDate,
      dueDate,
      amount: total,
      netAmount: subtotal,
      vatAmount: vatTotal,
      status,
      items,
      notes,
      paymentTerms: `${paymentTermsDays} Tage netto`
    };

    if (existingInv) {
      updateInvoice(existingInv.id, invData);
      addToast(customMessage || t(`Rechnung ${invoiceNumber} aktualisiert.`, `Invoice ${invoiceNumber} updated.`), "success");
    } else {
      createInvoice(invData);
      addToast(customMessage || t(`Rechnung ${invoiceNumber} erfolgreich erstellt!`, `Invoice ${invoiceNumber} created!`), "success");
    }

    setTimeout(() => navigate("/invoices"), 500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailModalOpen(false);
    handleSaveInvoice("sent", t(`Rechnung per E-Mail an ${emailRecipient} versendet!`, `Invoice sent to ${emailRecipient}!`));
  };

  const handleQuickAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustForm.name) return;
    const created = addCustomer({
      name: newCustForm.name,
      email: newCustForm.email,
      address: newCustForm.address,
      vatId: newCustForm.vatId,
      country: "Deutschland"
    });
    setSelectedCustomer(created);
    setNewCustomerModal(false);
    setNewCustForm({ name: "", email: "", address: "", vatId: "" });
    addToast(t(`Kunde ${created.name} angelegt und übernommen.`, `Customer ${created.name} added.`), "success");
  };

  return (
    <div className="page-content create-page" style={{ paddingBottom: 16 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 4, paddingLeft: 0 }} onClick={() => navigate("/invoices")}>
            <ArrowLeft size={14} /> {t("Zurück zu Rechnungen", "Back to invoices")}
          </button>
          <h1>{existingInv ? t("Rechnung bearbeiten", "Edit Invoice") : t("Rechnung schreiben", "Create Invoice")}</h1>
          <p>{t("Fortlaufende Rechnungsnummer:", "Sequential invoice number:")} <strong>{invoiceNumber}</strong></p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => handleSaveInvoice("draft")}>
            {t("Als Entwurf speichern", "Save draft")}
          </button>
          <button className="btn btn-secondary" onClick={handlePrintPdf}>
            <Download size={14} /> {t("PDF Drucken / Download", "Download PDF")}
          </button>
          <button className="btn btn-primary" onClick={() => {
            if (!selectedCustomer) {
              addToast(t("Bitte wählen Sie zuerst einen Kunden aus.", "Select a customer first."), "error");
              return;
            }
            setEmailModalOpen(true);
          }}>
            <Send size={14} /> {t("Fertigstellen & Senden", "Save & Send")}
          </button>
        </div>
      </div>

      {/* Split screen: Form links, Live PDF rechts */}
      <div className="create-layout">
        
        {/* LINKS: Editor */}
        <div className="create-form">
          
          {/* Kunde wählen */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label className="form-label required" style={{ margin: 0, fontWeight: 700 }}>
                {t("1. Kunde auswählen", "1. Customer")}
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--primary)", fontSize: 12 }}
                onClick={() => setNewCustomerModal(true)}
              >
                <Plus size={12} /> {t("Neuer Kunde", "New customer")}
              </button>
            </div>

            {selectedCustomer ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--primary-light)", borderRadius: 8, border: "1px solid var(--primary-border)" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--gray-900)" }}>{selectedCustomer.name}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{selectedCustomer.email} • {selectedCustomer.address}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCustomer(null)} title="Ändern">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <div className="search-input" style={{ width: "100%" }}>
                  <Search size={14} />
                  <input
                    placeholder={t("Kunde nach Name durchsuchen…", "Search customer by name…")}
                    value={customerSearch}
                    onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDD(true); }}
                    onFocus={() => setShowCustomerDD(true)}
                  />
                </div>
                {showCustomerDD && (
                  <div className="search-dropdown" style={{ width: "100%", maxHeight: 220, overflowY: "auto" }}>
                    {customers
                      .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
                      .map(c => (
                        <div
                          key={c.id}
                          className="search-dropdown-item"
                          onClick={() => {
                            setSelectedCustomer(c);
                            setShowCustomerDD(false);
                            setCustomerSearch("");
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600 }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{c.email} • {c.address}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rechnungsdaten & Zahlungskonditionen */}
          <div className="card" style={{ padding: 20 }}>
            <div className="form-label" style={{ fontWeight: 700, marginBottom: 12 }}>
              {t("2. Rechnungsdaten & Fristen", "2. Invoice Details & Terms")}
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">{t("Rechnungsdatum", "Invoice Date")}</label>
                <input
                  type="date"
                  className="form-control"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("Zahlungsziel", "Payment Terms")}</label>
                <select
                  className="form-control"
                  value={paymentTermsDays}
                  onChange={e => handleTermsChange(parseInt(e.target.value))}
                >
                  <option value={7}>7 Tage netto</option>
                  <option value={14}>14 Tage netto (Standard)</option>
                  <option value={30}>30 Tage netto</option>
                  <option value={0}>Sofort fällig</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t("Fälligkeitsdatum", "Due Date")}</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Positionen */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                {t("3. Rechnungspositionen", "3. Line Items")}
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                <Plus size={13} /> {t("Position hinzufügen", "Add line item")}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ padding: 12, background: "var(--gray-50)", borderRadius: 8, border: "1px solid var(--gray-200)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-400)", width: 20 }}>#{idx + 1}</span>
                    <select
                      className="form-control"
                      style={{ fontSize: 12, padding: "4px 8px" }}
                      onChange={e => handleSelectProduct(idx, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>-- {t("Aus Produktstamm wählen…", "Pick product/service…")} --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({fmt(p.price)})</option>
                      ))}
                    </select>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger)", padding: 4 }}
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: 8 }}>
                    <input
                      className="form-control"
                      placeholder={t("Beschreibung der Leistung / Ware", "Item description")}
                      value={it.description}
                      onChange={e => updateItem(idx, "description", e.target.value)}
                    />
                  </div>

                  <div className="line-fields">
                    <div>
                      <label style={{ fontSize: 10, color: "var(--gray-400)" }}>{t("Menge", "Qty")}</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.1"
                        value={it.qty}
                        onChange={e => updateItem(idx, "qty", e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "var(--gray-400)" }}>{t("Einheit", "Unit")}</label>
                      <input
                        className="form-control"
                        value={it.unit || "Std."}
                        onChange={e => updateItem(idx, "unit", e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "var(--gray-400)" }}>{t("Einzelpreis (€)", "Price")}</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        value={it.price}
                        onChange={e => updateItem(idx, "price", e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "var(--gray-400)" }}>{t("MwSt.", "VAT")}</label>
                      <select
                        className="form-control"
                        value={it.vat}
                        onChange={e => updateItem(idx, "vat", e.target.value)}
                      >
                        <option value={19}>19%</option>
                        <option value={7}>7%</option>
                        <option value={0}>0%</option>
                      </select>
                    </div>
                    <div className="line-total">
                      <label style={{ fontSize: 10, color: "var(--gray-400)" }}>{t("Gesamt netto", "Total")}</label>
                      <div className="line-total-value">
                        {fmt((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">{t("Bemerkung / Schlusstext für den Kunden", "Invoice Notes / Footer Text")}</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder={t("z. B. Wir bedanken uns für den Auftrag und freuen uns auf die weitere Zusammenarbeit.", "Optional note to customer")}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* RECHTS: Live DIN 5008 Rechnungsvorschau */}
        <div className="create-preview">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 4px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-500)", display: "flex", alignItems: "center", gap: 6 }}>
              <Eye size={13} /> {t("Live DIN 5008 Vorschau (Druckansicht)", "Live Document Preview")}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--success)", fontWeight: 600 }}>
              <Check size={12} /> GiroCode QR integriert
            </span>
          </div>

          <div className="card" style={{ padding: 24, boxShadow: "var(--shadow-md)" }}>
            <InvoiceDocPreview
              customer={selectedCustomer}
              items={items}
              invoiceNumber={invoiceNumber}
              issueDate={issueDate}
              dueDate={dueDate}
              notes={notes}
              paymentTerms={paymentTermsDays === 0 ? t("Sofort fällig", "Due immediately") : `${paymentTermsDays} ${t("Tage netto", "days net")}`}
              settings={settings}
              t={t}
            />
          </div>
        </div>
      </div>

      {/* Neuer Kunde Schnellanlage Modal */}
      <Modal isOpen={newCustomerModal} onClose={() => setNewCustomerModal(false)} title={t("Neuen Kunden anlegen", "Add New Customer")} width={500}>
        <form onSubmit={handleQuickAddCustomer}>
          <div className="form-group">
            <label className="form-label required">{t("Firmenname / Kundenname", "Customer Name")}</label>
            <input
              className="form-control"
              placeholder="z. B. Musterfirma GmbH"
              value={newCustForm.name}
              onChange={e => setNewCustForm({ ...newCustForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">{t("E-Mail für Rechnungsversand", "Billing Email")}</label>
            <input
              className="form-control"
              type="email"
              placeholder="rechnung@musterfirma.de"
              value={newCustForm.email}
              onChange={e => setNewCustForm({ ...newCustForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t("Anschrift (Straße, PLZ, Ort)", "Address")}</label>
            <input
              className="form-control"
              placeholder="Musterstr. 1, 10115 Berlin"
              value={newCustForm.address}
              onChange={e => setNewCustForm({ ...newCustForm, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t("USt-IdNr. (optional)", "VAT ID")}</label>
            <input
              className="form-control"
              placeholder="DE123456789"
              value={newCustForm.vatId}
              onChange={e => setNewCustForm({ ...newCustForm, vatId: e.target.value })}
            />
          </div>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setNewCustomerModal(false)}>
              {t("Abbrechen", "Cancel")}
            </button>
            <button type="submit" className="btn btn-primary">
              {t("Kunde speichern & auswählen", "Save Customer")}
            </button>
          </div>
        </form>
      </Modal>

      {/* E-Mail Sende-Modal */}
      <Modal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} title={t("Rechnung per E-Mail versenden", "Send Invoice by Email")} width={560}>
        <div>
          <div className="form-group">
            <label className="form-label required">{t("Empfänger E-Mail", "Recipient Email")}</label>
            <input
              className="form-control"
              value={emailRecipient}
              onChange={e => setEmailRecipient(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">{t("Betreff", "Subject")}</label>
            <input
              className="form-control"
              value={emailSubject}
              onChange={e => setEmailSubject(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t("Nachrichtenvorschau", "Message Preview")}</label>
            <div style={{ padding: 12, background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, lineHeight: 1.6, color: "var(--gray-700)" }}>
              Sehr geehrte Damen und Herren,<br /><br />
              anbei erhalten Sie die Rechnung <strong>{invoiceNumber}</strong> in Höhe von <strong>{fmt(total)}</strong>.<br />
              Bitte begleichen Sie den Betrag bis zum <strong>{fmtD(dueDate)}</strong>.<br /><br />
              Die Rechnung finden Sie im Anhang als PDF.<br /><br />
              Mit freundlichen Grüßen,<br />
              <strong>{settings.name}</strong>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--primary-light)", borderRadius: 6, fontSize: 12, color: "var(--primary)", marginBottom: 16 }}>
            <FileText size={15} /> Anhang: <strong>{invoiceNumber}.pdf</strong> ({fmt(total)})
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setEmailModalOpen(false)}>
              {t("Abbrechen", "Cancel")}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSendEmail}>
              <Send size={14} /> {t("Jetzt versenden", "Send Now")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
