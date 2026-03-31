export type Listing = {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  mode: "buy" | "rent" | "sell";
};

const listings: Listing[] = [
  { id: "l-1", title: "Modern Family Home", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994", price: 635000, location: "Austin, TX", mode: "buy" },
  { id: "l-2", title: "Riverside Condo", image: "https://images.unsplash.com/photo-1494526585095-c41746248156", price: 475000, location: "Denver, CO", mode: "buy" },
  { id: "l-3", title: "Downtown Loft", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6", price: 3200, location: "Seattle, WA", mode: "rent" },
  { id: "l-4", title: "Garden Apartment", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858", price: 2450, location: "Portland, OR", mode: "rent" },
  { id: "l-5", title: "List Your Property", image: "https://images.unsplash.com/photo-1460317442991-0ec209397118", price: 0, location: "Nationwide", mode: "sell" }
];

export const getListingsByMode = (mode: Listing["mode"]): Listing[] => listings.filter((item) => item.mode === mode);

export const getAdminListings = (): Listing[] => [...listings];
