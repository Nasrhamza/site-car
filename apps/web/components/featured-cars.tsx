import { api } from "@/lib/api";
import { CarCard } from "@/components/car-card";
import { buildWhatsAppUrl } from "@/lib/company";

async function getCars() {
  try {
    const { data } = await api.get("/cars/featured");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur chargement featured cars:", error);
    return [];
  }
}

export async function FeaturedCars() {
  const cars = await getCars();

  if (!cars.length) {
    return (
      <section className="container py-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Selection en vedette</h2>
          <p className="mt-3 text-white/70">
            Aucun vehicule en vedette pour le moment.
          </p>
          <a
            href={buildWhatsAppUrl(
              "Bonjour, je souhaite recevoir vos disponibilites en stock."
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Demander les disponibilites
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">
            Selection premium
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Vehicules en vedette
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cars.map((car: any) => (
          <CarCard
            key={car._id || car.id || car.slug}
            car={car}
          />
        ))}
      </div>
    </section>
  );
}
