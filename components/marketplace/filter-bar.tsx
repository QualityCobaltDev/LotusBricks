import type { ListingIntent } from "@/lib/marketplace-data";

type FilterBarProps = {
  intent: ListingIntent;
  cities: string[];
  selectedCity?: string;
  selectedPropertyType?: string;
  selectedBedrooms?: string;
  query?: string;
};

const propertyTypes = ["any", "Apartment", "Condo", "Villa", "Shophouse", "Land"] as const;

export function FilterBar({ intent, cities, selectedCity = "any", selectedPropertyType = "any", selectedBedrooms = "", query = "" }: FilterBarProps) {
  return (
    <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-5" method="get">
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder={`Search ${intent} listings`}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <select name="city" defaultValue={selectedCity} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="any">All Cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select
        name="propertyType"
        defaultValue={selectedPropertyType}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        {propertyTypes.map((propertyType) => (
          <option key={propertyType} value={propertyType}>
            {propertyType === "any" ? "Any Type" : propertyType}
          </option>
        ))}
      </select>
      <select name="bedrooms" defaultValue={selectedBedrooms} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="">Any Beds</option>
        <option value="1">1+ beds</option>
        <option value="2">2+ beds</option>
        <option value="3">3+ beds</option>
      </select>
      <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        Apply Filters
      </button>
    </form>
  );
}
