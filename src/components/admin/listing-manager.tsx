"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Listing } from "@/lib/db";

export function ListingManager({ seedListings }: { seedListings: Listing[] }) {
  const [items, setItems] = useState(seedListings);
  const [editingId, setEditingId] = useState<string | null>(null);

  const upsert = (formData: FormData) => {
    const id = String(formData.get("id") || `new-${Date.now()}`);
    const next: Listing = {
      id,
      title: String(formData.get("title") || ""),
      location: String(formData.get("location") || ""),
      image: String(formData.get("image") || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"),
      price: Number(formData.get("price") || 0),
      mode: (String(formData.get("mode") || "buy") as Listing["mode"])
    };

    setItems((current) => {
      const exists = current.some((item) => item.id === id);
      if (exists) return current.map((item) => (item.id === id ? next : item));
      return [next, ...current];
    });
    setEditingId(null);
  };

  return (
    <div className="card card-body">
      <h2>Manage Listings</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          upsert(new FormData(event.currentTarget));
          event.currentTarget.reset();
        }}
      >
        <input type="hidden" name="id" defaultValue={editingId ?? ""} />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          <Input name="title" placeholder="Title" required />
          <Input name="location" placeholder="Location" required />
          <Input name="image" placeholder="Image URL" />
          <Input name="price" type="number" placeholder="Price" min={0} required />
          <select className="select" name="mode" defaultValue="buy">
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
            <option value="sell">Sell</option>
          </select>
          <Button type="submit">{editingId ? "Update" : "Create"} listing</Button>
        </div>
      </form>

      <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Location</th>
            <th align="left">Mode</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderTop: "1px solid #d0d5dd" }}>
              <td>{item.title}</td>
              <td>{item.location}</td>
              <td>{item.mode}</td>
              <td style={{ display: "flex", gap: "0.5rem", padding: "0.5rem 0" }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(item.id);
                  }}
                >
                  Edit
                </Button>
                <Button type="button" variant="danger" onClick={() => setItems((curr) => curr.filter((it) => it.id !== item.id))}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
