import { Card, CardBody } from "@/components/ui/card";

const stats = [
  ["Active Listings", "148"],
  ["Pending Reviews", "9"],
  ["Open Tickets", "4"]
];

export default function AdminPage() {
  return (
    <section>
      <h1>Admin Dashboard</h1>
      <div className="grid cards">
        {stats.map(([label, value]) => (
          <Card key={label}><CardBody><p>{label}</p><h2>{value}</h2></CardBody></Card>
        ))}
      </div>
    </section>
  );
}
