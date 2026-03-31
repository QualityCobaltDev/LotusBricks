const viewingRequests = [
  { id: "V-101", property: "Modern Family Home", date: "2026-04-02", status: "Confirmed" },
  { id: "V-102", property: "Riverside Condo", date: "2026-04-04", status: "Pending" }
];

export default function ViewingsPage() {
  return (
    <section className="card card-body">
      <h1>Viewing requests</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th align="left">Property</th><th align="left">Date</th><th align="left">Status</th></tr>
        </thead>
        <tbody>
          {viewingRequests.map((item) => (
            <tr key={item.id} style={{ borderTop: "1px solid #d0d5dd" }}>
              <td>{item.property}</td><td>{item.date}</td><td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
