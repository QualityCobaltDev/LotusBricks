import type { Metadata } from "next";
import { EmptyState } from "@/components/marketplace/empty-state";
import { FilterBar } from "@/components/marketplace/filter-bar";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Section } from "@/components/site/section";
import { getCitiesForIntent, getListings, type ListingSummary } from "@/lib/marketplace-data";

type BuyPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Buy Property in Cambodia",
  description: "Browse verified Cambodia homes, condos, shophouses, and land with transparent listing facts."
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

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const params = await searchParams;
  const q = valueFromParam(params.q);
  const city = valueFromParam(params.city);
  const propertyType = getPropertyType(valueFromParam(params.propertyType));
  const bedroomsRaw = valueFromParam(params.bedrooms);
  const bathroomsRaw = valueFromParam(params.bathrooms);
  const bedrooms = bedroomsRaw ? Number(bedroomsRaw) : undefined;
  const bathrooms = bathroomsRaw ? Number(bathroomsRaw) : undefined;

  const listings = getListings({
    intent: "buy",
    q: q || undefined,
    city: city || undefined,
    propertyType: propertyType || undefined,
    bedrooms,
    bathrooms,
    verifiedOnly: valueFromParam(params.verifiedOnly) === "1",
    featuredOnly: valueFromParam(params.featuredOnly) === "1",
    newOnly: valueFromParam(params.newOnly) === "1",
    pool: valueFromParam(params.pool) === "1",
    gym: valueFromParam(params.gym) === "1"
  });

  return (
    <Section className="py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Buy property in Cambodia</h1>
        <p className="mt-2 text-slate-600">Search verified for-sale inventory across Phnom Penh and key growth cities.</p>
      </header>
      <p className="mt-3 text-sm text-slate-600">{listings.length} listings found</p>

      <div className="mt-6">
        <FilterBar
          intent="buy"
          cities={getCitiesForIntent("buy")}
          selectedCity={city || "any"}
          selectedPropertyType={propertyType ?? "any"}
          selectedBedrooms={bedroomsRaw}
          selectedBathrooms={bathroomsRaw}
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
            title="No listings match these filters"
            description="Adjust city, property type, or bedroom count to broaden your search."
          />
        </div>
      ) : (
        <div className="mt-8 flex justify-center">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700" type="button">
            Load more listings
          </button>
        </div>
      )}
    </Section>
  );
}
