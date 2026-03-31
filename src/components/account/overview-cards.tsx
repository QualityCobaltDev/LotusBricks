import { Card, CardBody } from "@/components/ui/card";

export function OverviewCards() {
  const items = [
    ["Saved Properties", "12"],
    ["Upcoming Viewings", "3"],
    ["Open Offers", "2"]
  ];

  return (
    <div className="grid cards">
      {items.map(([label, value]) => (
        <Card key={label}>
          <CardBody>
            <p style={{ margin: 0, color: "#475467" }}>{label}</p>
            <h3 style={{ marginBottom: 0 }}>{value}</h3>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
