import { createServerClient } from "@/lib/supabase-server";
import { getSite } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoGallery from "@/components/PhotoGallery";
import Header from "@/components/Header";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: family } = await supabase
    .from("families")
    .select("title, subtitle")
    .eq("slug", slug)
    .single();

  if (!family) return {};

  const site = getSite();
  return {
    title: `${family.title} — ${site.businessName}`,
    description: family.subtitle || `Réalisations ${family.title} par ${site.businessName}`,
  };
}

export default async function RealisationPage({ params }) {
  const { slug } = await params;
  const supabase = createServerClient();
  const site = getSite();

  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!family) notFound();

  const { data: photos } = await supabase
    .from("family_photos")
    .select("*")
    .eq("family_id", family.id)
    .order("order", { ascending: true });

  return (
    <main className="min-h-screen bg-transparent text-[#d1d2d4]">

      <Header phone={site.phone} />

      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href="/#realisations"
          className="inline-flex items-center gap-1.5 text-sm text-[#d1d2d4] hover:text-white transition"
        >
          ← Retour
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-[#d1d2d4]">{family.title}</h1>
          {family.subtitle && (
            <p className="mt-1 text-[#d1d2d4]">{family.subtitle}</p>
          )}
        </div>

        {photos && photos.length > 0 ? (
          <PhotoGallery photos={photos} familyTitle={family.title} />
        ) : (
          <div className="mt-12 text-center text-[#d1d2d4]">
            <p>Aucune photo pour le moment.</p>
          </div>
        )}

        <div className="mt-8 md:hidden">
          <Link
            href="/#realisations"
            className="inline-flex items-center gap-1.5 text-sm text-[#d1d2d4] hover:text-white transition"
          >
            ← Retour
          </Link>
        </div>
      </div>

      {/* BARRE D'ACTION (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#20313c]/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl gap-3 px-5 py-3">
          <a
            href={`tel:${site.phone.replaceAll(" ", "")}`}
            className="flex-1 rounded-xl bg-brand py-3 text-center font-medium text-white"
          >
            Appeler
          </a>
          <a
            href="/#contact"
            className="flex-1 rounded-xl border border-white/20 py-3 text-center font-medium text-[#d1d2d4]"
          >
            Devis
          </a>
        </div>
      </div>

      <div className="h-20 md:h-0" />

      <footer className="bg-[#111e26] text-slate-300">
        <div className="mx-auto max-w-6xl grid gap-8 px-5 py-12 text-sm md:grid-cols-3">
          <div>
            <div className="font-semibold text-white">{site.businessName}</div>
            <div className="text-slate-400">Johan GUERY</div>
            <div className="mt-1 text-slate-400">Artisan menuisier</div>
          </div>
          <div>
            <div className="font-semibold text-white">Zone d&apos;intervention</div>
            <div className="mt-2 text-slate-400">{site.serviceArea}</div>
          </div>
          <div>
            <div className="font-semibold text-white">Contact</div>
            <div className="mt-2 space-y-1">
              <div>
                <a className="text-slate-300 hover:text-white transition" href={`tel:${site.phone.replaceAll(" ", "")}`}>
                  {site.phone}
                </a>
              </div>
              <div>
                <a className="text-slate-300 hover:text-white transition" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-white/10 px-5 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {site.businessName}. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
