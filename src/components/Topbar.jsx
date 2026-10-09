import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, FileText, Users, Truck, Plus, Upload, Globe, AlertCircle, Sparkles, CheckCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { invoices, customers, suppliers } from "../data/mockData";

const activityIcons = {
  invoice_created: FileText,
  invoice_paid: CheckCircle,
  incoming_uploaded: Upload,
  reminder_sent: Bell,
  invoice_viewed: Eye,
};
const activityTones = {
  invoice_created: "blue",
  invoice_paid: "green",
  incoming_uploaded: "orange",
  reminder_sent: "red",
  invoice_viewed: "blue",
};

function fmtEuro(n) {
  return "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function activityPath(activity, invoiceList) {
  const match = String(activity.title || "").match(/INV-\d{4}-\d+/);
  if (match) {
    const invoice = invoiceList.find(item => item.number === match[0]);
    if (invoice) return `/invoices/${invoice.id}`;
  }
  if (activity.type === "incoming_uploaded") return "/incoming";
  if (String(activity.type || "").startsWith("invoice") || activity.type === "reminder_sent") return "/invoices";
  return "/";
}

export default function Topbar() {
  const { setMobileSidebarOpen, lang, setLanguage, t, invoices: liveInvoices, incomingInvoices, activities } = useApp();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("app_notif_read") || "[]"); }
    catch { return []; }
  });
  const navigate = useNavigate();
  const ref = useRef(null);
  const notifRef = useRef(null);

  const notifications = [
    ...liveInvoices.filter(invoice => invoice.status === "overdue").slice(0, 4).map(invoice => ({
      id: `overdue-${invoice.id}`,
      tone: "red",
      icon: AlertCircle,
      title: t("Rechnung überfällig", "Invoice overdue"),
      subtitle: `${invoice.number} · ${invoice.customerName} · ${fmtEuro(invoice.amount)}`,
      time: t("Zahlung ausstehend", "Payment overdue"),
      path: `/invoices/${invoice.id}`,
    })),
    ...incomingInvoices.filter(invoice => invoice.status === "pending_review").map(invoice => ({
      id: `review-${invoice.id}`,
      tone: "orange",
      icon: Sparkles,
      title: t("Beleg zur Prüfung", "Bill to review"),
      subtitle: `${invoice.supplier} · ${invoice.invoiceNumber} · ${fmtEuro(invoice.total)}`,
      time: t("KI-Daten bestätigen", "Confirm AI data"),
      path: `/incoming/${invoice.id}/review`,
    })),
    ...activities.slice(0, 4).map(activity => ({
      id: `act-${activity.id}`,
      tone: activityTones[activity.type] || "blue",
      icon: activityIcons[activity.type] || FileText,
      title: activity.title,
      subtitle: activity.subtitle,
      time: activity.time,
      path: activityPath(activity, liveInvoices),
    })),
  ];
  const unreadCount = notifications.filter(item => !readIds.includes(item.id)).length;

  const markRead = (id) => {
    setReadIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const openNotification = (item) => {
    markRead(item.id);
    setNotifOpen(false);
    navigate(item.path);
  };

  const results = query.length > 1 ? {
    invoices: invoices.filter(i => i.number.toLowerCase().includes(query.toLowerCase()) || i.customerName.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    customers: customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    suppliers: suppliers.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2),
  } : null;

  useEffect(() => {
    localStorage.setItem("app_notif_read", JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setNotifOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="topbar">
      <button className="topbar-icon-btn mobile-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
        <Menu size={18} />
      </button>

      <div className="topbar-search" ref={ref}>
        <Search size={15} />
        <input
          placeholder={t("Rechnungen, Kunden, Belege durchsuchen…", "Search invoices, customers, receipts…")}
          value={query}
          onChange={e => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
        />
        <span className="search-kbd">⌘K</span>
        {showResults && results && (
          <div className="search-dropdown">
            {results.invoices.length > 0 && (
              <>
                <div className="search-dropdown-section">{t("Rechnungen", "Invoices")}</div>
                {results.invoices.map(inv => (
                  <div key={inv.id} className="search-dropdown-item" onClick={() => { navigate(`/invoices/${inv.id}`); setShowResults(false); setQuery(""); }}>
                    <div className="item-icon"><FileText size={14} /></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{inv.number}</div>
                      <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{inv.customerName} · €{inv.amount.toLocaleString("de-DE")}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {results.customers.length > 0 && (
              <>
                <div className="search-dropdown-section">{t("Kunden", "Customers")}</div>
                {results.customers.map(c => (
                  <div key={c.id} className="search-dropdown-item" onClick={() => { navigate(`/customers/${c.id}`); setShowResults(false); setQuery(""); }}>
                    <div className="item-icon"><Users size={14} /></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{c.email}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {results.suppliers.length > 0 && (
              <>
                <div className="search-dropdown-section">{t("Lieferanten", "Suppliers")}</div>
                {results.suppliers.map(s => (
                  <div key={s.id} className="search-dropdown-item" onClick={() => { navigate(`/suppliers/${s.id}`); setShowResults(false); setQuery(""); }}>
                    <div className="item-icon"><Truck size={14} /></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{s.email}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {Object.values(results).every(a => a.length === 0) && (
              <div style={{ padding: "16px", textAlign: "center", color: "var(--gray-400)", fontSize: 13 }}>
                {t("Keine Treffer gefunden", "No results found")}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-lang"
          onClick={() => setLanguage(lang === "de" ? "en" : "de")}
          title={t("Sprache wechseln / Switch language", "Switch language")}
        >
          <Globe size={14} />
          {lang.toUpperCase()}
        </button>

        <div className="notif-wrap" ref={notifRef}>
          <button
            className="topbar-icon-btn"
            title={t("Benachrichtigungen", "Notifications")}
            aria-expanded={notifOpen}
            aria-label={t("Benachrichtigungen", "Notifications")}
            onClick={() => setNotifOpen(open => !open)}
          >
            <Bell size={16} />
            {unreadCount > 0 && <span className="topbar-notif-count">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="notif-panel" role="dialog" aria-label={t("Benachrichtigungen", "Notifications")}>
              <div className="notif-head">
                <strong>{t("Benachrichtigungen", "Notifications")}</strong>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark"
                    onClick={() => setReadIds(notifications.map(item => item.id))}
                  >
                    {t("Alle gelesen", "Mark all read")}
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">{t("Keine Benachrichtigungen", "No notifications")}</div>
                ) : notifications.map(item => {
                  const Icon = item.icon;
                  const unread = !readIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`notif-item ${unread ? "unread" : ""}`}
                      onClick={() => openNotification(item)}
                    >
                      <span className={`notif-icon ${item.tone}`}><Icon size={15} /></span>
                      <span className="notif-copy">
                        <span className="notif-item-title">{item.title}</span>
                        {item.subtitle && <span className="notif-item-sub">{item.subtitle}</span>}
                        {item.time && <span className="notif-item-time">{item.time}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate("/incoming")}
          title={t("Beleg oder Eingangsrechnung hochladen", "Upload receipt / bill")}
        >
          <Upload size={13} />
          <span className="btn-label">{t("Beleg scannen", "Scan bill")}</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/invoices/create")}
          title={t("Neue Kundenrechnung schreiben", "Create customer invoice")}
        >
          <Plus size={13} />
          <span className="btn-label">{t("Rechnung schreiben", "New invoice")}</span>
        </button>
      </div>
    </header>
  );
}
