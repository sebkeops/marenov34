import { getSite } from "@/lib/data";
import { createServerClient } from "@/lib/supabase-server";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export async function generateMetadata() {
  const site = getSite();
  return {
    title: `${site.businessName} — Portail & Menuiserie à ${site.city}`,
    description: `${site.tagline}. Plus de 20 ans d'expérience. ${site.serviceArea}. Devis gratuit.`,
    openGraph: {
      title: `${site.businessName} — Portail & Menuiserie à ${site.city}`,
      description: `${site.tagline}. Plus de 20 ans d'expérience. ${site.serviceArea}. Devis gratuit.`,
      url: "/",
      images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: `${site.businessName} — Artisan menuisier à ${site.city}` }],
    },
  };
}

export default async function Home() {
  const site = getSite();
  const supabase = createServerClient();

  const [
    { data: services },
    { data: families },
    { data: artisan },
    { data: spotlight },
  ] = await Promise.all([
    supabase.from("services").select("*").order("order", { ascending: true }),
    supabase.from("families").select("*").order("order", { ascending: true }),
    supabase.from("artisan").select("*").single(),
    supabase.from("spotlight").select("*").single(),
  ]);

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
              href="#contact"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Devis
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[520px] md:min-h-[460px]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.heroImage || "/images/hero.jpg"}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative px-5 pt-14 pb-10 md:pt-20 md:pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              <span className="opacity-90">{site.serviceArea}</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {site.businessName}
            </h1>

            <p className="mt-2 max-w-md text-white/85">{site.tagline}</p>

            <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center">
              <a
                href={`tel:${site.phone.replaceAll(" ", "")}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 shadow-sm md:w-auto"
              >
                Appeler
              </a>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur md:w-auto"
              >
                {site.ctaPrimary}
              </a>
            </div>

            <p className="mt-5 text-sm text-white/70">
              Réponse rapide • Devis gratuit • Travail soigné
            </p>
          </div>
        </div>
      </section>

      {/* À LA UNE */}
      {spotlight?.visible && (
        <section className="bg-amber-50 border-y-2 border-amber-300">
          <Reveal>
            <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-8">
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-sm bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
                  {spotlight.label || "À la une"}
                </span>
              </div>
              <div className="hidden md:block w-px self-stretch bg-amber-300" />
              <div className="min-w-0">
                {spotlight.title && (
                  <p className="text-base font-semibold text-slate-900">{spotlight.title}</p>
                )}
                {spotlight.text && (
                  <p className="mt-0.5 text-sm text-slate-600">{spotlight.text}</p>
                )}
              </div>
              {spotlight.image_url && (
                <div className="hidden md:block h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={spotlight.image_url} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* SERVICES */}
      {services && services.length > 0 && (
        <section className="px-5 py-12 border-t border-slate-100 bg-slate-50/70">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-semibold">Nos services</h2>
            <p className="mt-1 text-slate-600">
              Sur-mesure, pose et finitions soignées.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.05}>
                  <div className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                      {s.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image_url} alt={s.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{s.subtitle}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RÉALISATIONS */}
      {families && families.length > 0 && (
        <section className="px-5 py-12 border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-semibold">Réalisations</h2>
            <p className="mt-1 text-slate-600">
              Cliquez sur une catégorie pour voir nos réalisations.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {families.map((f, i) => (
                <Reveal key={f.id} delay={i * 0.05}>
                  <Link href={`/realisations/${f.slug}`} className="block">
                    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                      <div className="relative aspect-[4/3] bg-slate-100">
                        {f.cover_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={f.cover_image_url}
                            alt={f.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-sm font-semibold leading-snug">{f.title}</div>
                        {f.subtitle && (
                          <div className="mt-1 line-clamp-2 text-sm text-slate-600">{f.subtitle}</div>
                        )}
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* À PROPOS */}
      {artisan && (
        <section className="px-5 py-12 border-t border-slate-100 bg-slate-50/70">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-[180px_1fr] items-start">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artisan.photo_url || "/images/about.jpg"}
                  alt="Artisan menuisier"
                  className="h-40 md:h-44 w-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">{artisan.title}</h2>
                {artisan.bio && (
                  <p className="mt-2 text-slate-600">{artisan.bio}</p>
                )}
                {artisan.bullets && artisan.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 text-slate-700">
                    {artisan.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 h-0.5 w-4 bg-slate-300 rounded-full" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {artisan.trust_items && artisan.trust_items.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {artisan.trust_items.map((item, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                        ✓
                      </div>
                      <div className="text-sm font-medium text-slate-800">{item}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-5 py-12 border-t border-slate-100 bg-slate-50/70" id="contact">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-1 text-slate-600">
            Téléphone :{" "}
            <a className="underline" href={`tel:${site.phone.replaceAll(" ", "")}`}>
              {site.phone}
            </a>{" "}
            • Email :{" "}
            <a className="underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ContactForm />
        </div>
      </section>

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
            href="#contact"
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
            <div className="font-semibold text-white">Zone d'intervention</div>
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
