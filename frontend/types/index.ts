// Types partagés frontend.
export type CarFront = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  category: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  gearbox: string;
  exteriorColor: string;
  engineCapacity?: number | null;
  regionalSpecs?: string;
  price?: number | null;
  priceType: string;
  status: string;
  badges: string[];
  rating: number;
  views: number;
  liveWatchers: number;
  images: { url: string; alt: string }[];
  shortDescription?: string;
  equipment?: string[];
  features?: { label: string; value: string }[];
  featured?: boolean;
};

export type CategoryFront = {
  name: string;
  icon: string;
};

export type PostFront = {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: number;
  createdAt: string;
};
