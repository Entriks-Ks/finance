export default function StatusBadge({ status }) {
  const labels = {
    draft: "Draft", open: "Open", sent: "Sent", paid: "Paid", overdue: "Overdue",
    cancelled: "Cancelled", pending_review: "Pending Review", approved: "Approved",
    active: "Active", inactive: "Inactive", paused: "Paused", pending: "Pending",
    received: "Received", archived: "Archived",
  };
  return <span className={`badge badge-${status}`}>{labels[status] || status}</span>;
}
