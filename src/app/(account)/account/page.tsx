import { OverviewCards } from "@/components/account/overview-cards";

export default function AccountPage() {
  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <h1>Account Overview</h1>
      <OverviewCards />
    </section>
  );
}
