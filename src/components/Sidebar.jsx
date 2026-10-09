import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, RotateCcw, Users, Package,
  FileInput, Truck, CreditCard, BarChart2, Settings,
  ChevronLeft, ChevronRight, HelpCircle, Building2, X
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      section: null,
      items: [{ label: t("Dashboard", "Dashboard"), icon: LayoutDashboard, path: "/" }]
    },
    {
      section: t("Einnahmen", "Sales"),
      items: [
        { label: t("Rechnungen", "Invoices"), icon: FileText, path: "/invoices", badge: 4 },
        { label: t("Wiederkehrend", "Recurring"), icon: RotateCcw, path: "/recurring" },
        { label: t("Kunden", "Customers"), icon: Users, path: "/customers" },
        { label: t("Produkte & Services", "Products & Services"), icon: Package, path: "/products" },
      ]
    },
    {
      section: t("Ausgaben", "Purchases"),
      items: [
        { label: t("Belege & KI-Scan", "Incoming & AI"), icon: FileInput, path: "/incoming", badge: 2 },
        { label: t("Lieferanten", "Suppliers"), icon: Truck, path: "/suppliers" },
      ]
    },
    {
      section: t("Finanzen", "Finance"),
      items: [
        { label: t("Zahlungen & Bank", "Payments"), icon: CreditCard, path: "/payments" },
        { label: t("EÜR & Steuern", "Reports & Tax"), icon: BarChart2, path: "/reports" },
      ]
    },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const collapsed = sidebarCollapsed && !mobileSidebarOpen;

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {mobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />
      )}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <img className="logo-mark" src="/logo.svg" alt="FinanceApp" />
          {!collapsed && <span className="logo-name">FinanceApp</span>}
          {mobileSidebarOpen && (
            <button className="sidebar-toggle" onClick={() => setMobileSidebarOpen(false)} style={{ marginLeft: "auto" }}>
              <X size={16} />
            </button>
          )}
          {!mobileSidebarOpen && (
            <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ section, items }) => (
            <div key={section ?? "root"} className="nav-section">
              {section && <div className="nav-section-label">{section}</div>}
              {items.map(({ label, icon: Icon, path, badge }) => (
                <button
                  key={path}
                  className={`nav-item ${isActive(path) ? "active" : ""}`}
                  onClick={() => handleNav(path)}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={16} />
                  {!collapsed && <span className="nav-label">{label}</span>}
                  {!collapsed && badge && <span className="nav-badge">{badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className={`nav-item ${isActive("/settings") ? "active" : ""}`}
            onClick={() => handleNav("/settings")}
            title={collapsed ? t("Einstellungen", "Settings") : undefined}
          >
            <Settings size={16} />
            {!collapsed && <span className="nav-label">{t("Einstellungen", "Settings")}</span>}
          </button>
          <button className="nav-item" title={collapsed ? t("Hilfe", "Help") : undefined}>
            <HelpCircle size={16} />
            {!collapsed && <span className="nav-label">{t("Hilfe & Support", "Help & Support")}</span>}
          </button>
          <div className="sidebar-user" onClick={() => handleNav("/settings")}>
            <div className="user-avatar">MG</div>
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">Max Gruber</div>
                <div className="user-company"><Building2 size={11} /> My Company GmbH</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
