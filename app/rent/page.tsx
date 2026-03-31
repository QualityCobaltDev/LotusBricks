import type { Metadata } from "next";
import { EmptyState } from "@/components/marketplace/empty-state";
import { FilterBar } from "@/components/marketplace/filter-bar";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Section } from "@/components/site/section";
import { getCitiesForIntent, getListings, type ListingSummary } from "@/lib/marketplace-data";

type RentPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Rent Property in Cambodia",
  description: "Discover Cambodia rental listings from verified landlords, owners, and partner agents."
};

function valueFromParam(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] ?? "" : param ?? "";
}

const propertyTypes: Array<ListingSummary["propertyType"]> = ["Apartment", "Condo", "Villa", "Shophouse", "Land"];

function getPropertyType(value: string): ListingSummary["propertyType"] | "any" | undefined {
  if (!value) return undefined;
  if (value === "any") return "any";
  return propertyTypes.includes(value as ListingSummary["propertyType"])
    ? (value as ListingSummary["propertyType"])
    : undefined;
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const q = valueFromParam(params.q);
  const city = valueFromParam(params.city);
  const propertyType = getPropertyType(valueFromParam(params.propertyType));
  const bedroomsRaw = valueFromParam(params.bedrooms);
  const bedrooms = bedroomsRaw ? Number(bedroomsRaw) : undefined;

  const listings = getListings({
    intent: "rent",
    q: q || undefined,
    city: city || undefined,
    propertyType: propertyType || undefined,
    bedrooms
  });

  return (
    <Section className="py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Rent homes and apartments in Cambodia</h1>
        <p className="mt-2 text-slate-600">Compare long-term rental options with clear monthly pricing and owner response expectations.</p>
      </header>

      <div className="mt-6">
        <FilterBar
          intent="rent"
          cities={getCitiesForIntent("rent")}
          selectedCity={city || "any"}
          selectedPropertyType={propertyType ?? "any"}
          selectedBedrooms={bedroomsRaw}
          query={q}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No rental listings found"
            description="Try removing filters or changing location to discover more rentals."
          />
        </div>
      ) : (
        <div className="mt-8 flex justify-center">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700" type="button">
            Load more rentals
          </button>
        </div>
      )}
    </Section>
  );
}
