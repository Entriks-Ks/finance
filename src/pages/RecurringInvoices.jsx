import { useState } from "react";
import { Plus, Search, RotateCcw, Play, Pause, Trash2, Calendar, CheckCircle, Clock, Zap, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { useApp } from "../context/AppContext";
import { recurringInvoices as initialRecurring } from "../data/mockData";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export default function RecurringInvoices() {
  const { customers, addToast, t } = useApp();
  const [items, setItems] = useState(initialRecurring);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    customerId: customers[0]?.id || "",
    description: "",
    amount: "",
    frequency: "monthly",
    nextInvoice: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    autoSend: true,
  });

  const filtered = items.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.customerName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id) => {
    setItems(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const newStatus = r.status === "active" ? "paused" : "active";
        addToast(
          newStatus === "active"
            ? t(`Abo-Plan für ${r.customerName} wieder aktiviert.`, `Schedule for ${r.customerName} resumed.`)
            : t(`Abo-Plan für ${r.customerName} pausiert.`, `Schedule for ${r.customerName} paused.`),
          "info"
        );
        return { ...r, status: newStatus };
      })
    );
  };

  const handleRunNow = (r) => {
    addToast(
      t(`Rechnung für ${r.customerName} (${fmt(r.amount)}) sofort generiert und verbucht!`, `Generated invoice for ${r.customerName}!`),
      "success"
    );
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(r => r.id !== id));
    addToast(t("Dauerauftrag / Abo-Plan gelöscht.", "Schedule deleted."), "info");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) {
      addToast(t("Bitte füllen Sie alle Pflichtfelder aus.", "Fill required fields."), "error");
      return;
    }
    const cust = customers.find(c => c.id === form.customerId) || customers[0];
    const newItem = {
      id: "r" + Date.now(),
      customerId: cust.id,
      customerName: cust.name,
      description: form.description,
      amount: parseFloat(form.amount) || 0,
      frequency: form.frequency,
      nextInvoice: form.nextInvoice,
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      status: "active",
      autoSend: form.autoSend,
      items: [{ description: form.description, qty: 1, price: parseFloat(form.amount) || 0, vat: 19, total: parseFloat(form.amount) * 1.19 }]
    };
    setItems(prev => [newItem, ...prev]);
    setModalOpen(false);
    setForm({
      customerId: customers[0]?.id || "",
      description: "",
      amount: "",
      frequency: "monthly",
      nextInvoice: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      autoSend: true,
    });
    addToast(t(`Neuer Abo-Plan für ${cust.name} angelegt!`, `Recurring schedule created!`), "success");
  };

  const mrr = items.filter(i => i.status === "active").reduce((sum, item) => {
    if (item.frequency === "monthly") return sum + item.amount;
    if (item.frequency === "quarterly") return sum + item.amount / 3;
    if (item.frequency === "yearly") return sum + item.amount / 12;
    return sum + item.amount;
  }, 0);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>{t("Wiederkehrende Rechnungen & Abos", "Recurring Invoices & Subscriptions")}</h1>
          <p>{t("Automatisierte Abrechnung für monatliche Service-Verträge, Retainer und Software-Lizenzen.", "Automate subscription billing and retainers.")}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> {t("Neuen Abo-Plan anlegen", "New Schedule")}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeft: "4px solid #00b67a" }}>
          <div className="kpi-icon green"><Zap size={18} /></div>
          <div className="kpi-label">{t("Monatlicher Abo-Umsatz (MRR)", "Monthly Recurring Revenue")}</div>
          <div className="kpi-value" style={{ color: "#00b67a" }}>{fmt(mrr)}</div>
          <div className="kpi-meta">
            <span className="kpi-trend up">▲ 100% planbar</span> &nbsp;{t("pro Monat gesichert", "per month")}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon blue"><RotateCcw size={18} /></div>
          <div className="kpi-label">{t("Aktive Daueraufträge", "Active Schedules")}</div>
          <div className="kpi-value">{items.filter(i => i.status === "active").length}</div>
          <div className="kpi-meta">{items.length} {t("Pläne insgesamt eingerichtet", "total plans configured")}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orange"><Calendar size={18} /></div>
          <div className="kpi-label">{t("Nächster Abrechnungslauf", "Next Execution")}</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>01. Nov 2026</div>
          <div className="kpi-meta">2 {t("Rechnungen in Warteschlange", "invoices queued")}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon green"><Mail size={18} /></div>
          <div className="kpi-label">{t("Auto-Versand Quote", "Auto-Send Rate")}</div>
          <div className="kpi-value">
            {Math.round((items.filter(i => i.autoSend).length / (items.length || 1)) * 100)}%
          </div>
          <div className="kpi-meta">{t("Rechnungs-PDFs gehen automatisch per Mail", "Sent directly to customers")}</div>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="toolbar">
        <div className="search-input">
          <Search size={14} />
          <input
            placeholder={t("Kunde oder Vertragsbeschreibung suchen…", "Search customer or retainer title…")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">{t("Alle Status", "All statuses")}</option>
          <option value="active">{t("Nur Aktive", "Active only")}</option>
          <option value="paused">{t("Nur Pausierte", "Paused only")}</option>
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>
          {filtered.length} {t("Abo-Pläne", "profiles")}
        </span>
      </div>

      {/* Data Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <RotateCcw size={40} color="var(--primary)" />
            <div className="empty-title">{t("Keine wiederkehrenden Rechnungen gefunden", "No recurring schedules found")}</div>
            <div className="empty-sub">{t("Legen Sie Ihren ersten Abo-Vertrag an, um regelmäßige Zahlungen vollautomatisch abzurechnen.", "Create your first automated recurring invoice profile.")}</div>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> {t("Neuen Abo-Plan anlegen", "Create recurring profile")}
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>{t("Kunde & Vertrag", "Customer & Agreement")}</th>
                <th>{t("Intervall", "Interval")}</th>
                <th>{t("Abrechnungsbetrag", "Amount")}</th>
                <th>{t("Nächste Ausführung", "Next Run")}</th>
                <th>{t("Auto-Versand", "Auto-Email")}</th>
                <th>{t("Status (Aktiv/Pausiert)", "Active Toggle")}</th>
                <th style={{ textAlign: "right" }}>{t("Aktionen", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const isActive = r.status === "active";
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--gray-900)", fontSize: 14 }}>{r.customerName}</div>
                      <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{r.description}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "3px 9px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: r.frequency === "monthly" ? "#ecfdf5" : "#eff6ff",
                          color: r.frequency === "monthly" ? "#065f46" : "#1e40af",
                          border: r.frequency === "monthly" ? "1px solid #a7f3d0" : "1px solid #bfdbfe",
                          textTransform: "capitalize"
                        }}
                      >
                        {r.frequency === "monthly" ? t("Monatlich", "Monthly") : r.frequency === "quarterly" ? t("Quartalsweise", "Quarterly") : t("Jährlich", "Yearly")}
                      </span>
                    </td>
                    <td>
                      <div className="amount-cell" style={{ fontSize: 14 }}>{fmt(r.amount)}</div>
                      <div style={{ fontSize: 11, color: "var(--gray-400)" }}>netto zzgl. 19% MwSt.</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                        <Calendar size={13} color="var(--gray-400)" />
                        {fmtDate(r.nextInvoice)}
                      </div>
                    </td>
                    <td>
                      {r.autoSend ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#065f46", background: "#d1fae5", padding: "2px 8px", borderRadius: 9999 }}>
                          <Mail size={11} /> {t("PDF sofort senden", "Auto-sent")}
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: "var(--gray-500)", background: "var(--gray-100)", padding: "2px 8px", borderRadius: 9999 }}>
                          {t("Als Entwurf anlegen", "Draft only")}
                        </span>
                      )}
                    </td>
                    <td>
                      {/* iOS Style Interactive Toggle Switch */}
                      <label className="switch-toggle" title={isActive ? "Plan pausieren" : "Plan aktivieren"}>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleStatus(r.id)}
                        />
                        <span className="switch-slider" />
                      </label>
                      <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: isActive ? "#00b67a" : "var(--gray-400)" }}>
                        {isActive ? t("Aktiv", "Active") : t("Pausiert", "Paused")}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}
                          title={t("Rechnung jetzt sofort generieren", "Generate invoice now")}
                          onClick={() => handleRunNow(r)}
                        >
                          <Zap size={13} color="#00b67a" />
                          <span>{t("Jetzt ausführen", "Run now")}</span>
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "4px 6px", color: "var(--danger)" }}
                          title={t("Plan löschen", "Delete")}
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Neuer Dauerauftrag Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t("Neuen wiederkehrenden Rechnungsplan anlegen", "New Recurring Schedule")} width={540}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label required">{t("Kunde", "Customer")}</label>
            <select
              className="form-control"
              value={form.customerId}
              onChange={e => setForm({ ...form, customerId: e.target.value })}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">{t("Vertragsbezeichnung / Leistungsbeschreibung", "Retainer Title")}</label>
            <input
              className="form-control"
              placeholder="z. B. Monatliche Betreuung & Cloud Hosting Retainer"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">{t("Rechnungsbetrag netto (€)", "Net Amount (€)")}</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                placeholder="500.00"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">{t("Abrechnungsintervall", "Interval")}</label>
              <select
                className="form-control"
                value={form.frequency}
                onChange={e => setForm({ ...form, frequency: e.target.value })}
              >
                <option value="monthly">{t("Monatlich", "Monthly")}</option>
                <option value="quarterly">{t("Quartalsweise", "Quarterly")}</option>
                <option value="yearly">{t("Jährlich", "Yearly")}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">{t("Start- / Nächstes Ausführungsdatum", "First / Next Run Date")}</label>
            <input
              className="form-control"
              type="date"
              value={form.nextInvoice}
              onChange={e => setForm({ ...form, nextInvoice: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--gray-50)", borderRadius: 8, border: "1px solid var(--gray-200)", marginTop: 12 }}>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={form.autoSend}
                onChange={e => setForm({ ...form, autoSend: e.target.checked })}
              />
              <span className="switch-slider" />
            </label>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)" }}>
                {t("Automatischen E-Mail-Versand aktivieren", "Enable automatic email sending")}
              </div>
              <div style={{ fontSize: 11, color: "var(--gray-400)" }}>
                {t("Erstellt und versendet das Rechnungs-PDF pünktlich am Stichtag direkt an die Kunden-E-Mail.", "Directly emails PDF on execution date.")}
              </div>
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              {t("Abbrechen", "Cancel")}
            </button>
            <button type="submit" className="btn btn-primary">
              {t("Abo-Plan jetzt speichern", "Save Schedule")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
