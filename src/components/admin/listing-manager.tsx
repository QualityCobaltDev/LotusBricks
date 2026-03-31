"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Listing } from "@/lib/marketplace";

export function ListingManager({ seedListings }: { seedListings: Listing[] }) {
  const [items, setItems] = useState(seedListings);

  const create = (formData: FormData) => {
    const id = `lst_${Date.now()}`;
    const title = String(formData.get("title") || "");
    const type = String(formData.get("type") || "buy") as Listing["type"];
    const city = String(formData.get("city") || "Phnom Penh");
    const district = String(formData.get("district") || "BKK1");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const item: Listing = {
      id,
      slug,
      title,
      description: String(formData.get("description") || ""),
      type,
      propertyType: "Condo",
      city,
      district,
      address: String(formData.get("address") || city),
      price: Number(formData.get("price") || 0),
      currency: "USD",
      bedrooms: Number(formData.get("bedrooms") || 1),
      bathrooms: Number(formData.get("bathrooms") || 1),
      sizeSqm: Number(formData.get("sizeSqm") || 40),
      featured: Boolean(formData.get("featured")),
      published: Boolean(formData.get("published")),
      images: [String(formData.get("image") || "https://images.unsplash.com/photo-1494526585095-c41746248156")],
      videos: [],
      amenities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setItems((current) => [item, ...current]);
  };

  return (
    <div className="card card-body">
      <h2>Manage Listings</h2>
      <form onSubmit={(event) => { event.preventDefault(); create(new FormData(event.currentTarget)); event.currentTarget.reset(); }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          <Input name="title" placeholder="Title" required />
          <Input name="city" placeholder="City" required />
          <Input name="district" placeholder="District" required />
          <Input name="price" type="number" placeholder="Price" min={0} required />
          <select className="select" name="type" defaultValue="buy"><option value="buy">Buy</option><option value="rent">Rent</option></select>
          <label><input type="checkbox" name="featured" /> Featured</label>
          <label><input type="checkbox" name="published" defaultChecked /> Published</label>
          <Button type="submit">Create listing</Button>
        </div>
      </form>

      <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead><tr><th align="left">Title</th><th align="left">Type</th><th align="left">Location</th><th align="left">Status</th><th align="left">Actions</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderTop: "1px solid #d0d5dd" }}>
              <td>{item.title}</td><td>{item.type}</td><td>{item.city}, {item.district}</td><td>{item.published ? "Published" : "Draft"}</td>
              <td><Button type="button" variant="danger" onClick={() => setItems((curr) => curr.filter((it) => it.id !== item.id))}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
