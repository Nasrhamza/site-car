import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-premium flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">404</p>
      <h1 className="mt-3 font-serif text-6xl font-bold">Page introuvable</h1>
      <p className="mt-4 text-zinc-500">La page demandee est introuvable ou a ete deplacee.</p>
      <Link href="/catalogue" className="mt-8 rounded-full bg-brand px-6 py-3 font-semibold text-white">
        Retour au catalogue
      </Link>
    </div>
  );
}
