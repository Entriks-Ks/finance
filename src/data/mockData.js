// CUSTOMERS
export const customers = [
  { id: "c1", name: "ABC GmbH", email: "finance@abc-gmbh.de", phone: "+49 30 12345678", vatId: "DE123456789", address: "Musterstraße 12, 10115 Berlin", country: "Germany", contactPerson: "Thomas Müller", invoiceCount: 8, outstanding: 4200, lastInvoice: "2026-10-08", status: "active" },
  { id: "c2", name: "Example AG", email: "buchhaltung@example-ag.de", phone: "+49 89 98765432", vatId: "DE987654321", address: "Beispielweg 5, 80331 München", country: "Germany", contactPerson: "Maria Schmidt", invoiceCount: 5, outstanding: 1800, lastInvoice: "2026-09-30", status: "active" },
  { id: "c3", name: "Müller Consulting", email: "office@mueller-consulting.de", phone: "+49 40 55556666", vatId: "DE111222333", address: "Consultingplatz 3, 20099 Hamburg", country: "Germany", contactPerson: "Frank Müller", invoiceCount: 3, outstanding: 0, lastInvoice: "2026-09-15", status: "active" },
  { id: "c4", name: "Nova Solutions", email: "invoice@nova-solutions.de", phone: "+49 711 44445555", vatId: "DE444555666", address: "Innovationsstraße 88, 70173 Stuttgart", country: "Germany", contactPerson: "Lisa Wagner", invoiceCount: 6, outstanding: 2220, lastInvoice: "2026-10-01", status: "active" },
  { id: "c5", name: "Digital Works GmbH", email: "accounts@digitalworks.de", phone: "+49 221 77778888", vatId: "DE777888999", address: "Digitalweg 22, 50667 Köln", country: "Germany", contactPerson: "Andreas Klein", invoiceCount: 4, outstanding: 980, lastInvoice: "2026-09-20", status: "active" },
  { id: "c6", name: "TechStart Berlin", email: "hello@techstart.de", phone: "+49 30 99990000", vatId: "DE000111222", address: "Startup-Allee 1, 10247 Berlin", country: "Germany", contactPerson: "Sophie Bauer", invoiceCount: 2, outstanding: 0, lastInvoice: "2026-08-30", status: "inactive" },
  { id: "c7", name: "Schneider & Partner", email: "finanzen@schneider-partner.de", phone: "+49 351 33334444", vatId: "DE333444555", address: "Partnerstraße 7, 01067 Dresden", country: "Germany", contactPerson: "Klaus Schneider", invoiceCount: 9, outstanding: 3100, lastInvoice: "2026-10-05", status: "active" },
  { id: "c8", name: "Horizont Media", email: "ap@horizont-media.de", phone: "+49 211 22223333", vatId: "DE222333444", address: "Medienallee 14, 40210 Düsseldorf", country: "Germany", contactPerson: "Jana Wolf", invoiceCount: 3, outstanding: 0, lastInvoice: "2026-09-10", status: "active" },
  { id: "c9", name: "ProBuild AG", email: "rechnungen@probuild.de", phone: "+49 69 11112222", vatId: "DE999000111", address: "Baustraße 33, 60311 Frankfurt", country: "Germany", contactPerson: "Ralf Zimmer", invoiceCount: 7, outstanding: 5400, lastInvoice: "2026-10-07", status: "active" },
  { id: "c10", name: "GreenTech Solutions", email: "billing@greentech.de", phone: "+49 341 66667777", vatId: "DE666777888", address: "Ökologieweg 99, 04103 Leipzig", country: "Germany", contactPerson: "Petra Grün", invoiceCount: 2, outstanding: 1250, lastInvoice: "2026-09-25", status: "active" },
];

// SUPPLIERS
export const suppliers = [
  { id: "s1", name: "ABC Services GmbH", email: "finance@abc-services.de", phone: "+49 30 11112222", vatId: "DE100200300", address: "Servicestraße 10, 10115 Berlin", country: "Germany", openInvoices: 3, outstanding: 2430, lastInvoice: "2026-10-02", status: "active", iban: "DE12 3456 7890 1234 5678 90" },
  { id: "s2", name: "Office Supply GmbH", email: "rechnung@officesupply.de", phone: "+49 89 33334444", vatId: "DE400500600", address: "Büroweg 5, 80331 München", country: "Germany", openInvoices: 1, outstanding: 340, lastInvoice: "2026-10-01", status: "active", iban: "DE98 7654 3210 9876 5432 10" },
  { id: "s3", name: "Cloud Systems AG", email: "billing@cloudsystems.de", phone: "+49 40 55556666", vatId: "DE700800900", address: "Cloudstraße 77, 20099 Hamburg", country: "Germany", openInvoices: 2, outstanding: 1980, lastInvoice: "2026-09-30", status: "active", iban: "DE11 2345 6789 0123 4567 89" },
  { id: "s4", name: "Marketing Studio", email: "invoices@marketingstudio.de", phone: "+49 711 77778888", vatId: "DE010203040", address: "Kreativgasse 2, 70173 Stuttgart", country: "Germany", openInvoices: 1, outstanding: 890, lastInvoice: "2026-09-28", status: "active", iban: "DE55 6677 8899 0011 2233 44" },
  { id: "s5", name: "FastLog GmbH", email: "ar@fastlog.de", phone: "+49 221 99990000", vatId: "DE050607080", address: "Logistikweg 55, 50667 Köln", country: "Germany", openInvoices: 0, outstanding: 0, lastInvoice: "2026-09-15", status: "active", iban: "DE22 3344 5566 7788 9900 11" },
  { id: "s6", name: "Design Factory", email: "billing@designfactory.de", phone: "+49 30 88889999", vatId: "DE090000111", address: "Designplatz 8, 10247 Berlin", country: "Germany", openInvoices: 2, outstanding: 1540, lastInvoice: "2026-10-03", status: "active", iban: "DE44 5566 7788 9900 1122 33" },
  { id: "s7", name: "DataGuard AG", email: "accounts@dataguard.de", phone: "+49 351 22223333", vatId: "DE150250350", address: "Datenschutzstraße 1, 01067 Dresden", country: "Germany", openInvoices: 1, outstanding: 710, lastInvoice: "2026-09-22", status: "active", iban: "DE66 7788 9900 1122 3344 55" },
  { id: "s8", name: "Telecom Pro GmbH", email: "rechnung@telecompro.de", phone: "+49 69 44445555", vatId: "DE450550650", address: "Telekommunikationsallee 4, 60311 Frankfurt", country: "Germany", openInvoices: 1, outstanding: 220, lastInvoice: "2026-10-01", status: "inactive", iban: "DE77 8899 0011 2233 4455 66" },
];

// PRODUCTS
export const products = [
  { id: "p1", name: "Website Development", type: "service", description: "Custom website development and design", price: 1500, unit: "project", vat: 19, status: "active" },
  { id: "p2", name: "Consulting (hourly)", type: "service", description: "Business and strategy consulting per hour", price: 120, unit: "hour", vat: 19, status: "active" },
  { id: "p3", name: "Monthly Support", type: "service", description: "Monthly technical support retainer", price: 250, unit: "month", vat: 19, status: "active" },
  { id: "p4", name: "Software License – Basic", type: "product", description: "Basic software license per month", price: 49, unit: "month", vat: 19, status: "active" },
  { id: "p5", name: "Software License – Pro", type: "product", description: "Professional software license per month", price: 99, unit: "month", vat: 19, status: "active" },
  { id: "p6", name: "SEO Optimization", type: "service", description: "Search engine optimization package", price: 800, unit: "project", vat: 19, status: "active" },
  { id: "p7", name: "Social Media Management", type: "service", description: "Monthly social media management", price: 350, unit: "month", vat: 19, status: "active" },
  { id: "p8", name: "Server Setup", type: "service", description: "Cloud server configuration and deployment", price: 600, unit: "project", vat: 19, status: "active" },
  { id: "p9", name: "Logo Design", type: "service", description: "Professional logo design package", price: 450, unit: "project", vat: 19, status: "archived" },
  { id: "p10", name: "Training Workshop", type: "service", description: "Full-day training workshop on-site", price: 1200, unit: "day", vat: 19, status: "active" },
];

// INVOICES (OUTGOING)
export const invoices = [
  { id: "inv1", number: "INV-2026-0142", customerId: "c1", customerName: "ABC GmbH", issueDate: "2026-10-08", dueDate: "2026-10-22", amount: 2450, vatAmount: 391.60, netAmount: 2058.40, status: "open", items: [{ description: "Website Development", qty: 1, price: 1500, vat: 19, total: 1785 }, { description: "Monthly Support", qty: 3, price: 250, vat: 19, total: 892.50 }], notes: "Thank you for your business.", paymentTerms: "14 days net" },
  { id: "inv2", number: "INV-2026-0141", customerId: "c2", customerName: "Example AG", issueDate: "2026-10-05", dueDate: "2026-10-19", amount: 1190, vatAmount: 190, netAmount: 1000, status: "paid", paidDate: "2026-10-08", items: [{ description: "Consulting (hourly)", qty: 8, price: 120, vat: 19, total: 1142.40 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv3", number: "INV-2026-0140", customerId: "c9", customerName: "ProBuild AG", issueDate: "2026-09-30", dueDate: "2026-10-14", amount: 3570, vatAmount: 570, netAmount: 3000, status: "overdue", items: [{ description: "Server Setup", qty: 5, price: 600, vat: 19, total: 3570 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv4", number: "INV-2026-0139", customerId: "c4", customerName: "Nova Solutions", issueDate: "2026-09-25", dueDate: "2026-10-09", amount: 1785, vatAmount: 285, netAmount: 1500, status: "overdue", items: [{ description: "Website Development", qty: 1, price: 1500, vat: 19, total: 1785 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv5", number: "INV-2026-0138", customerId: "c1", customerName: "ABC GmbH", issueDate: "2026-09-20", dueDate: "2026-10-04", amount: 595, vatAmount: 95, netAmount: 500, status: "paid", paidDate: "2026-10-02", items: [{ description: "Monthly Support", qty: 2, price: 250, vat: 19, total: 595 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv6", number: "INV-2026-0137", customerId: "c7", customerName: "Schneider & Partner", issueDate: "2026-09-18", dueDate: "2026-10-02", amount: 4284, vatAmount: 684, netAmount: 3600, status: "paid", paidDate: "2026-10-01", items: [{ description: "Training Workshop", qty: 3, price: 1200, vat: 19, total: 4284 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv7", number: "INV-2026-0136", customerId: "c3", customerName: "Müller Consulting", issueDate: "2026-09-15", dueDate: "2026-09-29", amount: 952, vatAmount: 152, netAmount: 800, status: "paid", paidDate: "2026-09-27", items: [{ description: "Consulting (hourly)", qty: 6.67, price: 120, vat: 19, total: 952 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv8", number: "INV-2026-0135", customerId: "c5", customerName: "Digital Works GmbH", issueDate: "2026-09-12", dueDate: "2026-09-26", amount: 2380, vatAmount: 380, netAmount: 2000, status: "overdue", items: [{ description: "SEO Optimization", qty: 2.5, price: 800, vat: 19, total: 2380 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv9", number: "INV-2026-0134", customerId: "c6", customerName: "TechStart Berlin", issueDate: "2026-09-08", dueDate: "2026-09-22", amount: 4165, vatAmount: 665, netAmount: 3500, status: "paid", paidDate: "2026-09-20", items: [{ description: "Website Development", qty: 2, price: 1500, vat: 19, total: 3570 }, { description: "Logo Design", qty: 1, price: 450, vat: 19, total: 535.50 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv10", number: "INV-2026-0133", customerId: "c2", customerName: "Example AG", issueDate: "2026-09-05", dueDate: "2026-09-19", amount: 1178.50, vatAmount: 188.50, netAmount: 990, status: "paid", paidDate: "2026-09-18", items: [{ description: "Monthly Support", qty: 4, price: 250, vat: 19, total: 1190 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv11", number: "INV-2026-0132", customerId: "c10", customerName: "GreenTech Solutions", issueDate: "2026-09-01", dueDate: "2026-09-15", amount: 1487.50, vatAmount: 237.50, netAmount: 1250, status: "open", items: [{ description: "Software License – Pro", qty: 12, price: 99, vat: 19, total: 1415.52 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv12", number: "INV-2026-0131", customerId: "c8", customerName: "Horizont Media", issueDate: "2026-08-28", dueDate: "2026-09-11", amount: 3332, vatAmount: 532, netAmount: 2800, status: "paid", paidDate: "2026-09-09", items: [{ description: "Social Media Management", qty: 8, price: 350, vat: 19, total: 3332 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv13", number: "INV-2026-0130", customerId: "c4", customerName: "Nova Solutions", issueDate: "2026-08-22", dueDate: "2026-09-05", amount: 5950, vatAmount: 950, netAmount: 5000, status: "paid", paidDate: "2026-09-03", items: [{ description: "Website Development", qty: 3, price: 1500, vat: 19, total: 5355 }, { description: "Server Setup", qty: 1, price: 600, vat: 19, total: 714 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv14", number: "INV-2026-0129", customerId: "c7", customerName: "Schneider & Partner", issueDate: "2026-08-18", dueDate: "2026-09-01", amount: 1428, vatAmount: 228, netAmount: 1200, status: "paid", paidDate: "2026-08-30", items: [{ description: "Consulting (hourly)", qty: 10, price: 120, vat: 19, total: 1428 }], notes: "", paymentTerms: "14 days net" },
  { id: "inv15", number: "INV-2026-0128", customerId: "c9", customerName: "ProBuild AG", issueDate: "2026-08-12", dueDate: "2026-08-26", amount: 2380, vatAmount: 380, netAmount: 2000, status: "draft", items: [{ description: "Server Setup", qty: 4, price: 600, vat: 19, total: 2856 }], notes: "", paymentTerms: "14 days net" },
];

// INCOMING INVOICES
export const incomingInvoices = [
  { id: "ii1", supplier: "ABC Services GmbH", supplierId: "s1", invoiceNumber: "RE-2026-1034", invoiceDate: "2026-10-02", dueDate: "2026-10-16", net: 1042.52, vat: 197.48, total: 1240.00, iban: "DE12 3456 7890 1234 5678 90", reference: "RE-2026-1034", category: "IT Services", status: "pending_review", confidence: { supplier: 95, invoiceNumber: 98, invoiceDate: 97, dueDate: 94, net: 92, vat: 95, total: 99, iban: 88 } },
  { id: "ii2", supplier: "Office Supply GmbH", supplierId: "s2", invoiceNumber: "OS-2026-0892", invoiceDate: "2026-10-01", dueDate: "2026-10-15", net: 285.71, vat: 54.29, total: 340.00, iban: "DE98 7654 3210 9876 5432 10", reference: "OS-2026-0892", category: "Office Supplies", status: "approved" },
  { id: "ii3", supplier: "Cloud Systems AG", supplierId: "s3", invoiceNumber: "CS-2026-0455", invoiceDate: "2026-09-30", dueDate: "2026-10-14", net: 1663.03, vat: 316.97, total: 1980.00, iban: "DE11 2345 6789 0123 4567 89", reference: "CS-2026-0455", category: "Cloud Services", status: "approved" },
  { id: "ii4", supplier: "Marketing Studio", supplierId: "s4", invoiceNumber: "MS-2026-0234", invoiceDate: "2026-09-28", dueDate: "2026-10-12", net: 747.90, vat: 142.10, total: 890.00, iban: "DE55 6677 8899 0011 2233 44", reference: "MS-2026-0234", category: "Marketing", status: "paid", paidDate: "2026-10-07" },
  { id: "ii5", supplier: "Design Factory", supplierId: "s6", invoiceNumber: "DF-2026-0112", invoiceDate: "2026-10-03", dueDate: "2026-10-17", net: 1294.12, vat: 245.88, total: 1540.00, iban: "DE44 5566 7788 9900 1122 33", reference: "DF-2026-0112", category: "Design Services", status: "pending_review", confidence: { supplier: 91, invoiceNumber: 96, invoiceDate: 94, dueDate: 89, net: 87, vat: 91, total: 98, iban: 82 } },
  { id: "ii6", supplier: "DataGuard AG", supplierId: "s7", invoiceNumber: "DG-2026-0089", invoiceDate: "2026-09-22", dueDate: "2026-10-06", net: 596.64, vat: 113.36, total: 710.00, iban: "DE66 7788 9900 1122 3344 55", reference: "DG-2026-0089", category: "Legal & Compliance", status: "overdue" },
  { id: "ii7", supplier: "Telecom Pro GmbH", supplierId: "s8", invoiceNumber: "TP-2026-1567", invoiceDate: "2026-10-01", dueDate: "2026-10-31", net: 184.87, vat: 35.13, total: 220.00, iban: "DE77 8899 0011 2233 4455 66", reference: "TP-2026-1567", category: "Telecommunications", status: "approved" },
  { id: "ii8", supplier: "FastLog GmbH", supplierId: "s5", invoiceNumber: "FL-2026-0677", invoiceDate: "2026-09-15", dueDate: "2026-09-29", net: 420.17, vat: 79.83, total: 500.00, iban: "DE22 3344 5566 7788 9900 11", reference: "FL-2026-0677", category: "Logistics", status: "paid", paidDate: "2026-09-28" },
  { id: "ii9", supplier: "ABC Services GmbH", supplierId: "s1", invoiceNumber: "RE-2026-0998", invoiceDate: "2026-09-12", dueDate: "2026-09-26", net: 630.25, vat: 119.75, total: 750.00, iban: "DE12 3456 7890 1234 5678 90", reference: "RE-2026-0998", category: "IT Services", status: "paid", paidDate: "2026-09-25" },
  { id: "ii10", supplier: "Cloud Systems AG", supplierId: "s3", invoiceNumber: "CS-2026-0399", invoiceDate: "2026-08-31", dueDate: "2026-09-14", net: 1260.50, vat: 239.50, total: 1500.00, iban: "DE11 2345 6789 0123 4567 89", reference: "CS-2026-0399", category: "Cloud Services", status: "paid", paidDate: "2026-09-13" },
];

// RECURRING INVOICES
export const recurringInvoices = [
  { id: "r1", customerId: "c1", customerName: "ABC GmbH", description: "Monthly support retainer", amount: 595, frequency: "monthly", nextInvoice: "2026-11-01", startDate: "2026-01-01", endDate: null, status: "active", autoSend: true, items: [{ description: "Monthly Support", qty: 2, price: 250, vat: 19, total: 595 }] },
  { id: "r2", customerId: "c4", customerName: "Nova Solutions", description: "Software license subscription", amount: 117.81, frequency: "monthly", nextInvoice: "2026-11-01", startDate: "2026-03-01", endDate: "2027-02-28", status: "active", autoSend: false, items: [{ description: "Software License – Pro", qty: 1, price: 99, vat: 19, total: 117.81 }] },
  { id: "r3", customerId: "c7", customerName: "Schneider & Partner", description: "Quarterly consulting package", amount: 4284, frequency: "quarterly", nextInvoice: "2027-01-01", startDate: "2026-01-01", endDate: null, status: "paused", autoSend: true, items: [{ description: "Training Workshop", qty: 3, price: 1200, vat: 19, total: 4284 }] },
];

// PAYMENTS
export const payments = [
  { id: "pay1", invoiceNumber: "INV-2026-0141", customerId: "c2", customerName: "Example AG", amount: 1190, dueDate: "2026-10-19", paymentDate: "2026-10-08", method: "bank_transfer", status: "received" },
  { id: "pay2", invoiceNumber: "INV-2026-0138", customerId: "c1", customerName: "ABC GmbH", amount: 595, dueDate: "2026-10-04", paymentDate: "2026-10-02", method: "bank_transfer", status: "received" },
  { id: "pay3", invoiceNumber: "INV-2026-0137", customerId: "c7", customerName: "Schneider & Partner", amount: 4284, dueDate: "2026-10-02", paymentDate: "2026-10-01", method: "bank_transfer", status: "received" },
  { id: "pay4", invoiceNumber: "INV-2026-0136", customerId: "c3", customerName: "Müller Consulting", amount: 952, dueDate: "2026-09-29", paymentDate: "2026-09-27", method: "sepa", status: "received" },
  { id: "pay5", invoiceNumber: "INV-2026-0134", customerId: "c6", customerName: "TechStart Berlin", amount: 4165, dueDate: "2026-09-22", paymentDate: "2026-09-20", method: "bank_transfer", status: "received" },
  { id: "pay6", invoiceNumber: "INV-2026-0133", customerId: "c2", customerName: "Example AG", amount: 1178.50, dueDate: "2026-09-19", paymentDate: "2026-09-18", method: "paypal", status: "received" },
  { id: "pay7", invoiceNumber: "INV-2026-0132", customerId: "c8", customerName: "Horizont Media", amount: 3332, dueDate: "2026-09-11", paymentDate: "2026-09-09", method: "bank_transfer", status: "received" },
  { id: "pay8", invoiceNumber: "INV-2026-0130", customerId: "c4", customerName: "Nova Solutions", amount: 5950, dueDate: "2026-09-05", paymentDate: "2026-09-03", method: "bank_transfer", status: "received" },
  { id: "pay9", invoiceNumber: "INV-2026-0129", customerId: "c7", customerName: "Schneider & Partner", amount: 1428, dueDate: "2026-09-01", paymentDate: "2026-08-30", method: "sepa", status: "received" },
  { id: "pay10", invoiceNumber: "INV-2026-0142", customerId: "c1", customerName: "ABC GmbH", amount: 2450, dueDate: "2026-10-22", paymentDate: null, method: null, status: "pending" },
  { id: "pay11", invoiceNumber: "INV-2026-0140", customerId: "c9", customerName: "ProBuild AG", amount: 3570, dueDate: "2026-10-14", paymentDate: null, method: null, status: "overdue" },
  { id: "pay12", invoiceNumber: "INV-2026-0139", customerId: "c4", customerName: "Nova Solutions", amount: 1785, dueDate: "2026-10-09", paymentDate: null, method: null, status: "overdue" },
  { id: "pay13", invoiceNumber: "INV-2026-0135", customerId: "c5", customerName: "Digital Works GmbH", amount: 2380, dueDate: "2026-09-26", paymentDate: null, method: null, status: "overdue" },
  { id: "pay14", invoiceNumber: "INV-2026-0131", customerId: "c10", customerName: "GreenTech Solutions", amount: 1487.50, dueDate: "2026-09-15", paymentDate: null, method: null, status: "overdue" },
  { id: "pay15", invoiceNumber: "INV-2026-0128", customerId: "c9", customerName: "ProBuild AG", amount: 2380, dueDate: "2026-08-26", paymentDate: null, method: null, status: "pending" },
];

// REVENUE CHART DATA
export const revenueChartData = [
  { month: "May", paid: 12800, outstanding: 3200, overdue: 0 },
  { month: "Jun", paid: 18500, outstanding: 4100, overdue: 800 },
  { month: "Jul", paid: 15200, outstanding: 5800, overdue: 1200 },
  { month: "Aug", paid: 22400, outstanding: 3600, overdue: 2100 },
  { month: "Sep", paid: 19850, outstanding: 4200, overdue: 1850 },
  { month: "Oct", paid: 8420, outstanding: 8420, overdue: 2340 },
];

// ACTIVITY FEED
export const activityFeed = [
  { id: "a1", type: "invoice_created", title: "Invoice INV-2026-0142 created", subtitle: "ABC GmbH · €2,450.00", time: "2 hours ago", icon: "file-text" },
  { id: "a2", type: "invoice_paid", title: "Invoice INV-2026-0141 paid", subtitle: "Example AG · €1,190.00", time: "Yesterday", icon: "check-circle" },
  { id: "a3", type: "incoming_uploaded", title: "Incoming invoice from ABC Services GmbH uploaded", subtitle: "RE-2026-1034 · €1,240.00", time: "Yesterday", icon: "upload" },
  { id: "a4", type: "reminder_sent", title: "Payment reminder sent to ProBuild AG", subtitle: "INV-2026-0140 · €3,570.00 overdue", time: "2 days ago", icon: "bell" },
  { id: "a5", type: "invoice_viewed", title: "Invoice INV-2026-0142 viewed by customer", subtitle: "ABC GmbH", time: "3 days ago", icon: "eye" },
];

// COMPANY SETTINGS
export const companySettings = {
  name: "My Company GmbH",
  address: "Hauptstraße 100, 10115 Berlin, Germany",
  vatId: "DE123456789",
  taxNumber: "12/345/67890",
  email: "finance@mycompany.de",
  phone: "+49 30 12345678",
  iban: "DE89 3704 0044 0532 0130 00",
  bic: "COBADEFFXXX",
  bank: "Commerzbank AG",
  defaultVat: 19,
  defaultPaymentTerms: 14,
  defaultCurrency: "EUR",
  invoicePrefix: "INV",
  nextInvoiceNumber: 143,
};
