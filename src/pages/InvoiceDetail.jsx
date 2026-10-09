import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2, Send, Download, CheckCircle, ArrowLeft, Clock, Eye, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import GiroCode from "../components/GiroCode";
import { useApp } from "../context/AppContext";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, customers, settings, markInvoicePaid, addToast, t } = useApp();

  const invoice = invoices.find(i => i.id === id);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  if (!invoice) {
    return (
      <div className="page-content">
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div className="empty-state">
            <FileText size={40} color="var(--gray-400)" />
            <div className="empty-title">{t("Rechnung nicht gefunden", "Invoice not found")}</div>
            <div className="empty-sub">{t("Die aufgerufene Rechnung existiert nicht mehr.", "This invoice does not exist.")}</div>
            <button className="btn btn-primary" onClick={() => navigate("/invoices")}>
              {t("Zurück zu Rechnungen", "Back to invoices")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const customer = customers.find(c => c.id === invoice.customerId) || {
    name: invoice.customerName,
    address: "Musterstraße 12, 10115 Berlin",
    country: "Deutschland",
    vatId: "DE123456789"
  };

  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0) || (invoice.amount / 1.19);
  const vatAmt = invoice.items?.reduce((s, i) => s + ((parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0) * (parseFloat(i.vat) || 19) / 100), 0) || (invoice.amount - subtotal);

  const handleConfirmPaid = () => {
    markInvoicePaid(invoice.id);
    setMarkPaidOpen(false);
    addToast(t(`Rechnung ${invoice.number} als bezahlt verbucht.`, `Invoice ${invoice.number} marked as paid.`), "success");
  };

  const timelineItems = [
    { label: t("Entwurf erstellt", "Created"), date: fmtDate(invoice.issueDate), done: true, icon: FileText },
    { label: t("Rechnung versendet", "Sent"), date: fmtDate(invoice.issueDate), done: invoice.status !== "draft", icon: Send },
    { label: t("Vom Kunden eingesehen", "Viewed by customer"), date: fmtDate(invoice.issueDate), done: ["paid", "open"].includes(invoice.status), icon: Eye },
    { label: t("Zahlungseingang verbucht", "Payment received"), date: invoice.paidDate ? fmtDate(invoice.paidDate) : t("Ausstehend", "Pending"), done: invoice.status === "paid", icon: CheckCircle },
  ];

  return (
    <div className="page-content">
      {/* Top action bar */}
      <div className="action-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/invoices")} style={{ paddingLeft: 0 }}>
          <ArrowLeft size={14} /> {t("Zurück zu Rechnungen", "Back to invoices")}
        </button>

        <div className="action-bar-btns">
          <button className="btn btn-secondary" onClick={() => navigate(`/invoices/${invoice.id}/edit`)}>
            <Edit2 size={13} /> {t("Bearbeiten", "Edit")}
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Download size={13} /> {t("PDF Drucken / Export", "Print PDF")}
          </button>
          {invoice.status !== "paid" && (
            <button className="btn btn-primary" onClick={() => setMarkPaidOpen(true)} style={{ background: "#00b67a", borderColor: "#00b67a" }}>
              <CheckCircle size={14} /> {t("Als bezahlt markieren", "Mark as Paid")}
            </button>
          )}
        </div>
      </div>

      <div className="split">
        {/* LINKS: Original DIN 5008 Rechnungsdokument */}
        <div className="card" style={{ padding: 36, boxShadow: "var(--shadow-md)" }} id="printable-invoice">
          <div style={{ fontSize: 9, color: "var(--gray-400)", borderBottom: "1px solid #e2e8f0", paddingBottom: 4, marginBottom: 16 }}>
            {settings.name} • {settings.address}
          </div>

          <div className="invoice-doc-header" style={{ marginBottom: 24 }}>
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
              <div className="invoice-party-name" style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>{customer.name}</div>
              <div className="invoice-party-addr" style={{ fontSize: 12, color: "var(--gray-600)", lineHeight: 1.6 }}>
                {customer.address}<br />
                {customer.country}
                {customer.vatId && <><br />USt-IdNr.: {customer.vatId}</>}
              </div>
            </div>
            <div>
              <table className="invoice-meta-table">
                <tbody>
                  <tr><td>{t("Rechnungsnummer", "Invoice number")}</td><td style={{ fontWeight: 700 }}>{invoice.number}</td></tr>
                  <tr><td>{t("Rechnungsdatum", "Invoice date")}</td><td>{fmtDate(invoice.issueDate)}</td></tr>
                  <tr><td>{t("Fälligkeitsdatum", "Due date")}</td><td style={{ fontWeight: 700, color: "var(--gray-900)" }}>{fmtDate(invoice.dueDate)}</td></tr>
                  <tr><td>{t("Zahlungsziel", "Payment terms")}</td><td>{invoice.paymentTerms || "14 Tage netto"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="invoice-doc-title" style={{ fontSize: 20, fontWeight: 800, color: "var(--gray-900)", marginBottom: 14 }}>
            {t("Rechnung", "Invoice")} {invoice.number}
          </div>

          <table className="invoice-items-table" style={{ marginBottom: 20 }}>
            <thead>
              <tr>
                <th style={{ width: "8%" }}>Pos.</th>
                <th style={{ width: "42%" }}>{t("Bezeichnung", "Description")}</th>
                <th style={{ textAlign: "right", width: "12%" }}>{t("Menge", "Qty")}</th>
                <th style={{ textAlign: "right", width: "18%" }}>{t("Einzelpreis", "Unit price")}</th>
                <th style={{ textAlign: "right", width: "10%" }}>{t("MwSt.", "VAT")}</th>
                <th style={{ textAlign: "right", width: "18%" }}>{t("Gesamt netto", "Total")}</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || [{ description: "Dienstleistungen", qty: 1, price: subtotal, vat: 19 }]).map((it, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--gray-400)" }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{it.description}</td>
                  <td style={{ textAlign: "right" }}>{it.qty} {it.unit || "x"}</td>
                  <td style={{ textAlign: "right" }}>{fmt(it.price)}</td>
                  <td style={{ textAlign: "right" }}>{it.vat || 19}%</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{fmt(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-totals">
            <div className="invoice-totals-inner">
              <div className="invoice-total-row">
                <span className="invoice-total-label">{t("Zwischensumme netto", "Subtotal net")}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="invoice-total-row">
                <span className="invoice-total-label">zzgl. 19% MwSt.</span>
                <span>{fmt(vatAmt)}</span>
              </div>
              <div className="invoice-total-row grand" style={{ borderTop: "2px solid #0f172a", marginTop: 6, paddingTop: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{t("Gesamtbetrag brutto", "Total amount")}</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{fmt(invoice.amount)}</span>
              </div>
            </div>
          </div>

          <div className="pay-block">
            <div>
              <strong>{t("Bankverbindung für Überweisungen:", "Bank payment coordinates:")}</strong><br />
              Bank: <strong>{settings.bank}</strong><br />
              IBAN: <strong style={{ fontFamily: "monospace" }}>{settings.iban}</strong><br />
              BIC: <strong style={{ fontFamily: "monospace" }}>{settings.bic}</strong><br />
              Verwendungszweck: <strong>{invoice.number}</strong>
            </div>
            <GiroCode
              name={settings.name}
              iban={settings.iban}
              bic={settings.bic}
              amount={invoice.amount}
              reference={invoice.number}
              hint={t("Mit Banking-App scannen", "Scan with your banking app")}
            />
          </div>

          {invoice.notes && (
            <div style={{ marginTop: 14, fontSize: 11, color: "var(--gray-600)" }}>
              <strong>{t("Hinweis", "Note")}:</strong> {invoice.notes}
            </div>
          )}
        </div>

        {/* RECHTS: Meta-Panel & Status-Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* Status Box */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase" }}>
                {t("Status", "Status")}
              </span>
              <StatusBadge status={invoice.status} />
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--gray-900)", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              {fmt(invoice.amount)}
            </div>
            <div style={{ fontSize: 12, color: "var(--gray-400)" }}>
              Fällig am {fmtDate(invoice.dueDate)}
            </div>

            {invoice.status !== "paid" ? (
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
                onClick={() => setMarkPaidOpen(true)}
              >
                <CheckCircle size={14} /> {t("Zahlungseingang verbuchen", "Record payment")}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, color: "#065f46", background: "#d1fae5", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                <CheckCircle size={14} color="#10b981" /> {t("Vollständig bezahlt am ", "Paid on ")} {fmtDate(invoice.paidDate)}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", marginBottom: 16 }}>
              {t("Verlauf & Historie", "Timeline")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {timelineItems.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: step.done ? "#ecfdf5" : "var(--gray-100)",
                      color: step.done ? "#00b67a" : "var(--gray-400)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <Icon size={12} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: step.done ? 700 : 500, color: step.done ? "var(--gray-900)" : "var(--gray-400)" }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{step.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Zahlungs-Modal */}
      <Modal isOpen={markPaidOpen} onClose={() => setMarkPaidOpen(false)} title={t("Zahlung verbuchen", "Record Payment")} width={460}>
        <div>
          <div className="form-group">
            <label className="form-label required">{t("Zahlungsdatum", "Payment date")}</label>
            <input
              type="date"
              className="form-control"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">{t("Zahlungsart", "Payment method")}</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="bank_transfer">Banküberweisung (SEPA)</option>
              <option value="paypal">PayPal</option>
              <option value="credit_card">Kreditkarte</option>
              <option value="cash">Barzahlung</option>
            </select>
          </div>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setMarkPaidOpen(false)}>
              {t("Abbrechen", "Cancel")}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirmPaid}>
              {t("Zahlung bestätigen", "Confirm Payment")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
