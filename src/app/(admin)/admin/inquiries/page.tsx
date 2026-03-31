import { getInquiries } from "@/lib/marketplace";

export default function AdminInquiriesPage() {
  const inquiries = getInquiries();

  return (
    <section className="card card-body">
      <h1>Inquiries</h1>
      {inquiries.length === 0 ? <p>No inquiries yet.</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th align="left">Name</th><th align="left">Email</th><th align="left">Message</th><th align="left">Date</th></tr></thead>
          <tbody>
            {inquiries.map((inq) => <tr key={inq.id} style={{ borderTop: "1px solid #d0d5dd" }}><td>{inq.name}</td><td>{inq.email}</td><td>{inq.message}</td><td>{new Date(inq.createdAt).toLocaleString()}</td></tr>)}
          </tbody>
        </table>
      )}
    </section>
  );
}
