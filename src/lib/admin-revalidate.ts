import { revalidatePath } from "next/cache";

export function revalidatePublicListings(slug?: string | null, previousSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/listings/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/listings/${previousSlug}`);
}

export function revalidatePublicContent() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/pricing");
  revalidatePath("/support");
  revalidatePath("/legal/privacy");
  revalidatePath("/legal/terms");
  revalidatePath("/legal/accessibility");
}
