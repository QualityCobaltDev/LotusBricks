import type { ListingIntent } from "@/lib/marketplace-data";

type FilterBarProps = {
  intent: ListingIntent;
  cities: string[];
  selectedCity?: string;
  selectedPropertyType?: string;
  selectedBedrooms?: string;
  selectedBathrooms?: string;
  query?: string;
};

const propertyTypes = ["any", "Apartment", "Condo", "Villa", "Shophouse", "Land"] as const;

export function FilterBar({ intent, cities, selectedCity = "any", selectedPropertyType = "any", selectedBedrooms = "", selectedBathrooms = "", query = "" }: FilterBarProps) {
  return (
    <form className="sticky top-16 grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:grid-cols-7" method="get">
      <input type="text" name="q" defaultValue={query} placeholder={`Search ${intent} listings`} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm md:col-span-2" />
      <select name="city" defaultValue={selectedCity} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"><option value="any">All Cities</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select>
      <select name="propertyType" defaultValue={selectedPropertyType} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">{propertyTypes.map((propertyType) => <option key={propertyType} value={propertyType}>{propertyType === "any" ? "Any Type" : propertyType}</option>)}</select>
      <select name="bedrooms" defaultValue={selectedBedrooms} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"><option value="">Beds</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select>
      <select name="bathrooms" defaultValue={selectedBathrooms} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"><option value="">Baths</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select>
      <div className="flex gap-2"><button type="submit" className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">Apply</button><a href={intent === "buy" ? "/buy" : "/rent"} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">Reset</a></div>
      <div className="md:col-span-7 flex flex-wrap gap-3 text-xs text-neutral-600"><label><input type="checkbox" name="verifiedOnly" value="1" className="mr-1"/>Verified</label><label><input type="checkbox" name="featuredOnly" value="1" className="mr-1"/>Featured</label><label><input type="checkbox" name="newOnly" value="1" className="mr-1"/>New</label><label><input type="checkbox" name="pool" value="1" className="mr-1"/>Pool</label><label><input type="checkbox" name="gym" value="1" className="mr-1"/>Gym</label></div>
    </form>
  );
}
