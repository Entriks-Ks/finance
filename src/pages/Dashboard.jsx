import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp, Clock, AlertCircle, ArrowDownCircle, FileText, CheckCircle, Upload, Bell, Eye, Users,
  Sparkles, ChevronRight, RotateCcw, BarChart2
} from "lucide-react";
import { revenueChartData } from "../data/mockData";
import { useApp } from "../context/AppContext";

function fmt(n) {
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const activityIcons = { invoice_created: FileText, invoice_paid: CheckCircle, incoming_uploaded: Upload, reminder_sent: Bell, invoice_viewed: Eye };
const activityDotClass = { invoice_created: "created", invoice_paid: "paid", incoming_uploaded: "uploaded", reminder_sent: "reminder", invoice_viewed: "viewed" };

const chartSeries = [
  { key: "paid", color: "#00b67a" },
  { key: "outstanding", color: "#3b82f6" },
  { key: "overdue", color: "#ef4444" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { invoices, incomingInvoices, activities, addToast, t } = useApp();
  const [dateRange, setDateRange] = useState("month");

  const totalPaidRevenue = invoices
    .filter(i => i.status === "paid")
    .reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const totalOutstanding = invoices
    .filter(i => ["open", "sent"].includes(i.status))
    .reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const totalOverdue = invoices
    .filter(i => i.status === "overdue")
    .reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const totalExpenses = incomingInvoices
    .reduce((s, i) => s + (Number(i.total) || 0), 0);

  const openInvoicesCount = invoices.filter(i => ["open", "sent"].includes(i.status)).length;
  const overdueInvoicesCount = invoices.filter(i => i.status === "overdue").length;
  const pendingReviewBills = incomingInvoices.filter(i => i.status === "pending_review").length;

  const dateRanges = [
    { key: "month", label: t("Monat", "Month") },
    { key: "quarter", label: t("Quartal", "Quarter") },
    { key: "year", label: t("Jahr", "Year") },
  ];

  const seriesLabels = {
    paid: t("Bezahlt", "Paid"),
    outstanding: t("Offen", "Outstanding"),
    overdue: t("Überfällig", "Overdue"),
  };

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t("Guten Morgen", "Good morning")
    : hour < 18
    ? t("Guten Tag", "Good afternoon")
    : t("Guten Abend", "Good evening");

  const kpis = [
    {
      label: t("Realisierter Umsatz", "Collected revenue"),
      value: fmt(totalPaidRevenue),
      icon: TrendingUp, tone: "green",
      meta: <><span className="kpi-trend up">+12.4%</span> {t("zum Vormonat", "vs. last month")}</>,
    },
    {
      label: t("Offene Forderungen", "Outstanding"),
      value: fmt(totalOutstanding),
      icon: Clock, tone: "blue",
      meta: `${openInvoicesCount} ${t("offene Rechnungen", "open invoices")}`,
    },
    {
      label: t("Überfällig", "Overdue"),
      value: fmt(totalOverdue),
      icon: AlertCircle, tone: "red",
      valueClass: overdueInvoicesCount > 0 ? "danger" : "",
      meta: `${overdueInvoicesCount} ${t("Rechnungen überfällig", "invoices overdue")}`,
    },
    {
      label: t("Betriebsausgaben", "Expenses"),
      value: fmt(totalExpenses),
      icon: ArrowDownCircle, tone: "orange",
      meta: `${incomingInvoices.length} ${t("erfasste Belege", "recorded bills")}`,
    },
  ];

  const tasks = [
    overdueInvoicesCount > 0 && {
      tone: "red", icon: AlertCircle,
      title: `${overdueInvoicesCount} ${t("überfällige Rechnungen", "overdue invoices")}`,
      desc: `${fmt(totalOverdue)} ${t("noch nicht bezahlt", "still unpaid")}`,
      action: t("Mahnen", "Remind"), onClick: () => navigate("/invoices"),
    },
    pendingReviewBills > 0 && {
      tone: "orange", icon: Sparkles,
      title: `${pendingReviewBills} ${t("Belege zur KI-Prüfung", "bills to review")}`,
      desc: t("Ausgelesene Daten bestätigen", "Confirm AI-extracted data"),
      action: t("Prüfen", "Review"), onClick: () => navigate("/incoming"),
    },
    {
      tone: "blue", icon: RotateCcw,
      title: t("Wiederkehrende Rechnung morgen", "Recurring invoice tomorrow"),
      desc: t("ABC GmbH wird automatisch erstellt", "ABC GmbH will be created automatically"),
      action: t("Details", "Details"), onClick: () => navigate("/recurring"),
    },
    {
      tone: "green", icon: BarChart2,
      title: t("USt-Voranmeldung vorbereiten", "Prepare VAT return"),
      desc: t("Umsatzsteuer und Vorsteuer abgleichen", "Reconcile collected and input VAT"),
      action: t("Bericht", "Report"), onClick: () => navigate("/reports"),
    },
  ].filter(Boolean);

  const quickActions = [
    { label: t("Rechnung schreiben", "New invoice"), icon: FileText, action: () => navigate("/invoices/create") },
    { label: t("Beleg scannen", "Scan bill"), icon: Upload, action: () => navigate("/incoming") },
    { label: t("Kunde anlegen", "Add customer"), icon: Users, action: () => { navigate("/customers"); addToast(t("Kundenformular geöffnet…", "Customer form opened…"), "info"); } },
    { label: t("EÜR & Steuern", "Reports & tax"), icon: TrendingUp, action: () => navigate("/reports") },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{greeting}, Max</h1>
          <p>{t("Ihre Finanzen auf einen Blick.", "Your finances at a glance.")}</p>
        </div>
        <div className="page-header-actions">
          <div className="segmented">
            {dateRanges.map(r => (
              <button
                key={r.key}
                className={`segmented-item ${dateRange === r.key ? "active" : ""}`}
                onClick={() => setDateRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-strip">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="kpi-strip-item">
              <div className="kpi-strip-label">
                <span className={`kpi-strip-icon ${k.tone}`}><Icon size={14} /></span>
                {k.label}
              </div>
              <div className={`kpi-strip-value ${k.valueClass || ""}`}>{k.value}</div>
              <div className="kpi-meta">{k.meta}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>{t("Umsatzverlauf", "Revenue")}</h2>
              <div className="card-subtitle">{t("Letzte 6 Monate", "Last 6 months")}</div>
            </div>
            <div className="chart-legend">
              {chartSeries.map(s => (
                <span key={s.key} className="chart-legend-item">
                  <span className="chart-legend-dot" style={{ background: s.color }} />
                  {seriesLabels[s.key]}
                </span>
              ))}
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  {chartSeries.map(s => (
                    <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} stroke="#eef2f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + "k"} />
                <Tooltip
                  formatter={(v, name) => [fmt(v), name]}
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 8px 20px -6px rgba(15,23,42,.12)" }}
                />
                {chartSeries.map(s => (
                  <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} fill={`url(#grad-${s.key})`} name={seriesLabels[s.key]} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>{t("Zu erledigen", "To do")}</h2>
            <span className="count-pill">{tasks.length}</span>
          </div>
          <div className="task-list">
            {tasks.map(task => {
              const Icon = task.icon;
              return (
                <button key={task.title} className="task-item" onClick={task.onClick}>
                  <span className={`task-icon ${task.tone}`}><Icon size={15} /></span>
                  <span className="task-content">
                    <span className="task-title">{task.title}</span>
                    <span className="task-desc">{task.desc}</span>
                  </span>
                  <span className="task-action">{task.action}<ChevronRight size={14} /></span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>{t("Letzte Aktivitäten", "Recent activity")}</h2>
          </div>
          <div className="activity-list">
            {activities.slice(0, 5).map(a => {
              const Icon = activityIcons[a.type] || FileText;
              return (
                <div key={a.id} className="activity-item">
                  <div className={`activity-dot ${activityDotClass[a.type] || "created"}`}>
                    <Icon size={13} />
                  </div>
                  <div className="activity-text">
                    <div className="activity-title">{a.title}</div>
                    {a.subtitle && <div className="activity-sub">{a.subtitle}</div>}
                  </div>
                  <div className="activity-time">{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>{t("Schnellzugriff", "Quick actions")}</h2>
          </div>
          <div className="quick-grid">
            {quickActions.map(qa => {
              const Icon = qa.icon;
              return (
                <button key={qa.label} className="quick-tile" onClick={qa.action}>
                  <span className="quick-tile-icon"><Icon size={18} /></span>
                  <span className="quick-tile-label">{qa.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
