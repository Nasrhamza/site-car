import { FeaturedCars } from "@/components/featured-cars";
import { HomeFinalCta } from "@/components/home-final-cta";
import { HomeGlobalExport } from "@/components/home-global-export";
import { HomeTrust } from "@/components/home-trust";
import { MarketplaceValue } from "@/components/marketplace-value";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getHomeCars() {
  try {
    const { data } = await api.get("/cars", {
      params: {
        limit: 24,
        sort: "-createdAt"
      }
    });

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur chargement home cars:", error);
    return [];
  }
}

export default async function HomePage() {
  const cars = await getHomeCars();

  return (
    <>
      <MarketplaceValue />
      <FeaturedCars cars={cars} />
      <HomeGlobalExport />
      <HomeTrust totalCars={cars.length} />
      <HomeFinalCta imageUrl={cars[1]?.images?.[0]?.url || cars[0]?.images?.[0]?.url} />
    </>
  );
}
