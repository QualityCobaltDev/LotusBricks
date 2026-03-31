const users = [
  { id: "u1", name: "Jordan Lee", role: "Agent", email: "jordan@lotusbricks.com" },
  { id: "u2", name: "Mia Chen", role: "Buyer", email: "mia@example.com" }
];

export default function AdminUsersPage() {
  return (
    <section className="card card-body">
      <h1>User Management</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr><th align="left">Name</th><th align="left">Role</th><th align="left">Email</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderTop: "1px solid #d0d5dd" }}>
              <td>{user.name}</td><td>{user.role}</td><td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
