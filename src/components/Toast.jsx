import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const icons = { success: CheckCircle, error: AlertCircle, info: Info };

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  // Strictly maximum 3 toasts displayed at any time
  const visibleToasts = (toasts || []).slice(-3);

  return (
    <div className="toast-container">
      {visibleToasts.map(t => {
        const Icon = icons[t.type] || Info;
        return (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="toast-icon"><Icon size={16} /></div>
            <div className="toast-text">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--gray-400)", padding: 2, display: "flex", alignItems: "center" }}
              title="Schließen"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
