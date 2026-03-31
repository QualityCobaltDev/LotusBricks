const reports = [
  { name: "Monthly Lead Conversion", status: "Ready" },
  { name: "Listing Performance", status: "Generating" },
  { name: "Revenue by Tier", status: "Ready" }
];

export default function AdminReportsPage() {
  return (
    <section className="card card-body">
      <h1>Reports</h1>
      <ul>
        {reports.map((report) => (
          <li key={report.name}>{report.name} — {report.status}</li>
        ))}
      </ul>
    </section>
  );
}
