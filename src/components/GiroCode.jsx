import { QRCodeSVG } from "qrcode.react";

// EPC069-12 GiroCode: a banking app reads the IBAN, amount and reference from this.
function epcPayload({ name, iban, bic, amount, reference }) {
  const clean = (value, max) => String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
  const euros = Number(amount);
  const amountField = Number.isFinite(euros) && euros > 0 ? "EUR" + euros.toFixed(2) : "";

  return [
    "BCD",
    "002",
    "1",
    "SCT",
    clean(bic, 11).replace(/\s+/g, "").toUpperCase(),
    clean(name, 70),
    clean(iban, 42).replace(/\s+/g, "").toUpperCase(),
    amountField,
    "",
    "",
    clean(reference, 140),
  ].join("\n");
}

export default function GiroCode({ name, iban, bic, amount, reference, hint = "Mit Banking-App scannen" }) {
  if (!String(iban || "").trim()) return null;

  return (
    <div className="girocode">
      <QRCodeSVG
        value={epcPayload({ name, iban, bic, amount, reference })}
        size={112}
        level="M"
        marginSize={1}
        bgColor="#ffffff"
        fgColor="#0f172a"
      />
      <div className="girocode-label">EPC-QR GiroCode</div>
      <div className="girocode-hint">{hint}</div>
    </div>
  );
}
