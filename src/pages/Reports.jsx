import { useState } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign, FileSpreadsheet, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";

function fmt(n) {
  return "€" + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const financialData = [
  { month: "May 2026", revenue: 16000, expenses: 4200, vatCollected: 2554, vatPaid: 670, profit: 11800 },
  { month: "Jun 2026", revenue: 22600, expenses: 5800, vatCollected: 3608, vatPaid: 926, profit: 16800 },
  { month: "Jul 2026", revenue: 21000, expenses: 6100, vatCollected: 3352, vatPaid: 974, profit: 14900 },
  { month: "Aug 2026", revenue: 26000, expenses: 7300, vatCollected: 4151, vatPaid: 1165, profit: 18700 },
  { month: "Sep 2026", revenue: 24050, expenses: 6450, vatCollected: 3840, vatPaid: 1030, profit: 17600 },
  { month: "Oct 2026", revenue: 16840, expenses: 4890, vatCollected: 2688, vatPaid: 780, profit: 11950 },
];

export default function Reports() {
  const { addToast } = useApp();
  const [selectedYear, setSelectedYear] = useState("2026");

  const totalRevenue = financialData.reduce((s, i) => s + i.revenue, 0);
  const totalExpenses = financialData.reduce((s, i) => s + i.expenses, 0);
  const totalVatCollected = financialData.reduce((s, i) => s + i.vatCollected, 0);
  const totalVatPaid = financialData.reduce((s, i) => s + i.vatPaid, 0);
  const netProfit = totalRevenue - totalExpenses;
  const vatPayable = totalVatCollected - totalVatPaid;

  const handleExport = (type) => {
    addToast(`Exported ${selectedYear} financial report as ${type.toUpperCase()}`, "success");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Financial Reports & Tax</h1>
          <p>Profit & loss statement, revenue vs expenses, and preliminary VAT report (USt-Voranmeldung).</p>
        </div>
        <div className="page-header-actions">
          <select className="date-range-picker" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="2026">Fiscal Year 2026</option>
            <option value="2025">Fiscal Year 2025</option>
          </select>
          <button className="btn btn-secondary" onClick={() => handleExport("csv")}>
            <FileSpreadsheet size={14} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => handleExport("pdf")}>
            <Download size={14} /> Export Tax PDF
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><TrendingUp size={16} /></div>
          <div className="kpi-label">Total Outgoing Revenue</div>
          <div className="kpi-value">{fmt(totalRevenue)}</div>
          <div className="kpi-meta">Net invoiced sales</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><TrendingDown size={16} /></div>
          <div className="kpi-label">Total Incoming Expenses</div>
          <div className="kpi-value">{fmt(totalExpenses)}</div>
          <div className="kpi-meta">Operating & supplier costs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><DollarSign size={16} /></div>
          <div className="kpi-label">Operating Profit (EBT)</div>
          <div className="kpi-value">{fmt(netProfit)}</div>
          <div className="kpi-meta">{(netProfit / totalRevenue * 100).toFixed(1)}% net profit margin</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red"><Calendar size={16} /></div>
          <div className="kpi-label">VAT Balance (Payable)</div>
          <div className="kpi-value">{fmt(vatPayable)}</div>
          <div className="kpi-meta">Umsatzsteuer minus Vorsteuer</div>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--gray-900)" }}>Revenue vs Expenses Comparison</h3>
            <p style={{ fontSize: 12, color: "var(--gray-400)" }}>Monthly trends for Q2 - Q4 2026</p>
          </div>
        </div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8892b0" }} axisLine={{ stroke: "#e2e8f0" }} />
              <YAxis tick={{ fontSize: 12, fill: "#8892b0" }} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={v => `€${v/1000}k`} />
              <Tooltip formatter={(value) => [fmt(value), ""]} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="revenue" name="Revenue (€)" fill="#3b5bfd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses (€)" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit (€)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Monthly P&L Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-900)" }}>Monthly P&L & VAT Breakdown</h3>
          <span style={{ fontSize: 12, color: "var(--gray-400)" }}>Currency: EUR (€)</span>
        </div>
        <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Net Revenue</th>
              <th>VAT Collected (19%)</th>
              <th>Operating Expenses</th>
              <th>Deductible VAT (Vorsteuer)</th>
              <th>Net Profit</th>
              <th style={{ textAlign: "right" }}>VAT Remittance</th>
            </tr>
          </thead>
          <tbody>
            {financialData.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{row.month}</td>
                <td style={{ color: "var(--primary)", fontWeight: 500 }}>{fmt(row.revenue)}</td>
                <td>{fmt(row.vatCollected)}</td>
                <td style={{ color: "var(--warning)", fontWeight: 500 }}>{fmt(row.expenses)}</td>
                <td>{fmt(row.vatPaid)}</td>
                <td style={{ color: "var(--success)", fontWeight: 600 }}>{fmt(row.profit)}</td>
                <td style={{ textAlign: "right", fontWeight: 600, color: "var(--gray-900)" }}>
                  {fmt(row.vatCollected - row.vatPaid)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--gray-50)", fontWeight: 700 }}>
              <td>Full Year Total</td>
              <td style={{ color: "var(--primary)" }}>{fmt(totalRevenue)}</td>
              <td>{fmt(totalVatCollected)}</td>
              <td style={{ color: "var(--warning)" }}>{fmt(totalExpenses)}</td>
              <td>{fmt(totalVatPaid)}</td>
              <td style={{ color: "var(--success)" }}>{fmt(netProfit)}</td>
              <td style={{ textAlign: "right" }}>{fmt(vatPayable)}</td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>
    </div>
  );
}
