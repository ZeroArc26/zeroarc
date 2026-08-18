export interface CollectionMeta {
  name: string;
  slug: string;
  tag: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition?: string;
}

// Products get tagged with the `tag` value in the admin Product form
// (Basic Info -> Tags, comma-separated) to appear on a category's page.

export const COLLECTIONS: CollectionMeta[] = [
  {
    name: "Arc Essentials",
    slug: "arc-essentials",
    tag: "arc-essentials",
    subtitle: "Collection",
    description:
      "Clean, timeless and versatile. ARC Essentials are premium everyday T-shirts designed for effortless style, comfort and daily wear.",
    image: "/images/collections/collection-essential.png",
  },
  {
    name: "Arc Oversized",
    slug: "arc-oversized",
    tag: "arc-oversized",
    subtitle: "Collection",
    description:
      "Relaxed fit. Drop shoulders. Maximum attitude. Designed for a modern streetwear look with the comfort of an oversized silhouette.",
    image: "/images/collections/collection-oversized.png",
  },
  {
    name: "Arc Graphics",
    slug: "arc-graphics",
    tag: "arc-graphics",
    subtitle: "Collection",
    description:
      "Bold artwork meets street culture. Explore statement graphics created to make your outfit stand out wherever you go.",
    image: "/images/collections/collection-graphics.png",
  },
  {
    name: "Arc Anime",
    slug: "arc-anime",
    tag: "arc-anime",
    subtitle: "Collection",
    description:
      "Enter your favorite world. Anime-inspired designs built for fans who want to bring their passion into everyday streetwear.",
    image: "/images/collections/collection-anime.png",
  },
  {
    name: "Arc Gaming",
    slug: "arc-gaming",
    tag: "arc-gaming",
    subtitle: "Collection",
    description:
      "Level up your style. Gaming-inspired T-shirts featuring designs made for players, creators and gaming culture.",
    image: "/images/collections/collection-gaming.png",
  },
  {
    name: "Bestsellers",
    slug: "bestsellers",
    tag: "bestsellers",
    subtitle: "Collection",
    description:
      "The pieces everyone wants. Discover ZERO ARC CO.'s most-loved designs, proven favorites and customer top picks.",
    image: "/images/collections/collection-bestsellers.png",
  },
];

export function getCollectionBySlug(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}