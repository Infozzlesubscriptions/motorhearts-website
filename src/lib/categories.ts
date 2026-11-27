export const PUBLIC_CATEGORY_SLUGS = [
  "motorcycles",
  "electric-bikes",
  "classic-cars",
  "performance-tuning",
  "trailers-towing",
  "chauffeur-luxury-transport",
] as const;

export function isPublicCategory(category: { slug: string }) {
  return PUBLIC_CATEGORY_SLUGS.some(slug => slug === category.slug);
}
