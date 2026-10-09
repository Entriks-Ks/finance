import { useState } from "react";
import { Building2, Landmark, Percent, FileText, Check, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { companySettings } from "../data/mockData";

export default function Settings() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState("company");
  const [settings, setSettings] = useState({ ...companySettings });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    addToast("Settings successfully saved!", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Company & System Settings</h1>
          <p>Manage your company profile, bank accounts, tax details, and invoice formatting defaults.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>
            {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="settings-layout">
        {/* Settings Navigation Tabs */}
        <div className="card settings-nav">
          <button
            className={`nav-item ${activeTab === "company" ? "active" : ""}`}
            style={{ justifyContent: "flex-start", borderRadius: 6, marginBottom: 4 }}
            onClick={() => setActiveTab("company")}
          >
            <Building2 size={16} /> Company Profile
          </button>
          <button
            className={`nav-item ${activeTab === "tax" ? "active" : ""}`}
            style={{ justifyContent: "flex-start", borderRadius: 6, marginBottom: 4 }}
            onClick={() => setActiveTab("tax")}
          >
            <ShieldCheck size={16} /> Tax & Legal
          </button>
          <button
            className={`nav-item ${activeTab === "banking" ? "active" : ""}`}
            style={{ justifyContent: "flex-start", borderRadius: 6, marginBottom: 4 }}
            onClick={() => setActiveTab("banking")}
          >
            <Landmark size={16} /> Banking & SEPA
          </button>
          <button
            className={`nav-item ${activeTab === "invoicing" ? "active" : ""}`}
            style={{ justifyContent: "flex-start", borderRadius: 6 }}
            onClick={() => setActiveTab("invoicing")}
          >
            <FileText size={16} /> Invoicing Defaults
          </button>
        </div>

        {/* Tab Content Form */}
        <form className="card settings-form" onSubmit={handleSubmit}>
          {activeTab === "company" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Company Information</h3>
              <p style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 20 }}>
                This information appears on all your issued invoices and letterheads.
              </p>

              <div className="form-group">
                <label className="form-label required">Company Name</label>
                <input
                  className="form-control"
                  value={settings.name}
                  onChange={e => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Business Address</label>
                <input
                  className="form-control"
                  value={settings.address}
                  onChange={e => handleChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Billing Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={settings.email}
                    onChange={e => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    value={settings.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Currency</label>
                <select
                  className="form-control"
                  value={settings.defaultCurrency}
                  onChange={e => handleChange("defaultCurrency", e.target.value)}
                >
                  <option value="EUR">EUR (€) – Euro</option>
                  <option value="USD">USD ($) – US Dollar</option>
                  <option value="GBP">GBP (£) – British Pound</option>
                  <option value="CHF">CHF (CHF) – Swiss Franc</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "tax" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Tax & Registration Numbers</h3>
              <p style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 20 }}>
                Required for tax compliance, Reverse-Charge, and official B2B invoices.
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">VAT Identification (USt-IdNr.)</label>
                  <input
                    className="form-control"
                    value={settings.vatId}
                    onChange={e => handleChange("vatId", e.target.value)}
                    placeholder="DE123456789"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Tax Number (Steuernummer)</label>
                  <input
                    className="form-control"
                    value={settings.taxNumber}
                    onChange={e => handleChange("taxNumber", e.target.value)}
                    placeholder="12/345/67890"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Competent Tax Office (Finanzamt)</label>
                  <input
                    className="form-control"
                    defaultValue="Finanzamt Berlin Mitte"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Commercial Registry (HRB)</label>
                  <input
                    className="form-control"
                    defaultValue="HRB 234567 B (Amtsgericht Charlottenburg)"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "banking" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Bank Account & SEPA Wire</h3>
              <p style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 20 }}>
                Recipients use these coordinates to remit invoice settlements.
              </p>

              <div className="form-group">
                <label className="form-label required">Bank Name</label>
                <input
                  className="form-control"
                  value={settings.bank}
                  onChange={e => handleChange("bank", e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">IBAN</label>
                  <input
                    className="form-control"
                    style={{ fontFamily: "monospace" }}
                    value={settings.iban}
                    onChange={e => handleChange("iban", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">BIC / SWIFT</label>
                  <input
                    className="form-control"
                    style={{ fontFamily: "monospace" }}
                    value={settings.bic}
                    onChange={e => handleChange("bic", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoicing" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Invoice Presets & Numbering</h3>
              <p style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 20 }}>
                Configure consecutive invoice numbering and default payment deadlines.
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Invoice Number Prefix</label>
                  <input
                    className="form-control"
                    value={settings.invoicePrefix}
                    onChange={e => handleChange("invoicePrefix", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Next Sequential Number</label>
                  <input
                    className="form-control"
                    type="number"
                    value={settings.nextInvoiceNumber}
                    onChange={e => handleChange("nextInvoiceNumber", parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Default Payment Terms (Days)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={settings.defaultPaymentTerms}
                    onChange={e => handleChange("defaultPaymentTerms", parseInt(e.target.value) || 14)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Standard VAT Rate (%)</label>
                  <select
                    className="form-control"
                    value={settings.defaultVat}
                    onChange={e => handleChange("defaultVat", parseInt(e.target.value) || 19)}
                  >
                    <option value={19}>19% (Standard rate Germany)</option>
                    <option value={7}>7% (Reduced rate)</option>
                    <option value={0}>0% (Tax exempt / Reverse charge)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Invoice Footer Note</label>
                <textarea
                  className="form-control"
                  rows={3}
                  defaultValue="Please transfer the total amount within the specified payment terms to the bank account above quoting the invoice number. Thank you for your trust!"
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--gray-200)", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary">
              {saved ? <><Check size={14} /> Saved!</> : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
