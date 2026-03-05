import { createServerClient } from "@/lib/supabase-server";
import { getSite } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoGallery from "@/components/PhotoGallery";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: family } = await supabase
    .from("families")
    .select("title, subtitle")
    .eq("id", id)
    .single();

  if (!family) return {};

  const site = getSite();
  return {
    title: `${family.title} — ${site.businessName}`,
    description: family.subtitle || `Réalisations ${family.title} par ${site.businessName}`,
  };
}

export default async function RealisationPage({ params }) {
  const { id } = await params;
  const supabase = createServerClient();
  const site = getSite();

  const [{ data: family }, { data: photos }] = await Promise.all([
    supabase.from("families").select("*").eq("id", id).single(),
    supabase
      .from("family_photos")
      .select("*")
      .eq("family_id", id)
      .order("order", { ascending: true }),
  ]);

  if (!family) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-900">

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="text-sm font-semibold tracking-tight">
            {site.businessName}
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a
              href={`tel:${site.phone.replaceAll(" ", "")}`}
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {site.phone}
            </a>
            <a
              href="/#contact"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Devis
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
        >
          ← Retour
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight">{family.title}</h1>
          {family.subtitle && (
            <p className="mt-1 text-slate-600">{family.subtitle}</p>
          )}
        </div>

        {photos && photos.length > 0 ? (
          <PhotoGallery photos={photos} familyTitle={family.title} />
        ) : (
          <div className="mt-12 text-center text-slate-400">
            <p>Aucune photo pour le moment.</p>
          </div>
        )}
      </div>

      {/* BARRE D'ACTION (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl gap-3 px-5 py-3">
          <a
            href={`tel:${site.phone.replaceAll(" ", "")}`}
            className="flex-1 rounded-xl bg-slate-900 py-3 text-center font-medium text-white"
          >
            Appeler
          </a>
          <a
            href="/#contact"
            className="flex-1 rounded-xl border border-slate-200 py-3 text-center font-medium"
          >
            Devis
          </a>
        </div>
      </div>

      <div className="h-20 md:h-0" />

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-6xl grid gap-8 px-5 py-12 text-sm md:grid-cols-3">
          <div>
            <div className="font-semibold text-white">{site.businessName}</div>
            <div className="mt-2 text-slate-400">Artisan menuisier à {site.city}</div>
          </div>
          <div>
            <div className="font-semibold text-white">Zone d&apos;intervention</div>
            <div className="mt-2 text-slate-400">{site.serviceArea}</div>
          </div>
          <div>
            <div className="font-semibold text-white">Contact</div>
            <div className="mt-2">
              <a className="text-slate-300 hover:text-white transition" href={`tel:${site.phone.replaceAll(" ", "")}`}>
                {site.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-slate-800 px-5 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {site.businessName}. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
