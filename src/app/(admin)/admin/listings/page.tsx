import { ListingManager } from "@/components/admin/listing-manager";
import { getAdminListings } from "@/lib/marketplace";

export default function AdminListingsPage() {
  return <ListingManager seedListings={getAdminListings()} />;
}
