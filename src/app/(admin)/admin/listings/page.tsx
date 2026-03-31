import { ListingManager } from "@/components/admin/listing-manager";
import { getAdminListings } from "@/lib/db";

export default function AdminListingsPage() {
  return <ListingManager seedListings={getAdminListings()} />;
}
