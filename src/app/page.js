import { getSite } from "@/lib/data";
import { createServerClient } from "@/lib/supabase-server";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

export const dynamic = 'force-dynamic';

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
    <main className="min-h-screen bg-transparent text-[#d1d2d4]">

      <Header phone={site.phone} />

      {/* HERO */}
      <section className="relative min-h-[520px] md:min-h-[460px]">
        <div className="absolute inset-0">
          <Image
            src={site.heroImage || "/images/hero.jpg"}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
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
        <section className="bg-blue-100/50 border-y border-blue-200">
          <Reveal>
            <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-8">
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-sm bg-brand px-4 py-2 text-sm font-bold uppercase tracking-widest text-white">
                  {spotlight.label || "À la une"}
                </span>
              </div>
              <div className="hidden md:block w-px self-stretch bg-[#2c3a47]" />
              <div className="min-w-0">
                {spotlight.title && (
                  <p className="text-base font-semibold text-slate-800">{spotlight.title}</p>
                )}
                {spotlight.text && (
                  <p className="mt-0.5 text-sm text-slate-600">{spotlight.text}</p>
                )}
              </div>
              {spotlight.image_url && (
                <div className="relative hidden md:block h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image src={spotlight.image_url} alt="" fill className="object-cover" sizes="96px" />
                </div>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* SERVICES */}
      {services && services.length > 0 && (
        <section id="services" className="px-5 py-12 border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-semibold text-[#d1d2d4]">Nos services</h2>
            <p className="mt-1 text-[#d1d2d4]">
              Sur-mesure, pose et finitions soignées.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.05}>
                  <div className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                      {s.image_url && (
                        <Image src={s.image_url} alt={s.title} fill className="object-cover" sizes="96px" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{s.title}</div>
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
        <section id="realisations" className="px-5 py-12 border-t border-white/10 bg-transparent">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-semibold text-[#d1d2d4]">Réalisations</h2>
            <p className="mt-1 text-[#d1d2d4]">
              Cliquez sur une catégorie pour voir nos réalisations.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {families.map((f, i) => (
                <Reveal key={f.id} delay={i * 0.05}>
                  <Link href={`/realisations/${f.slug}`} className="block h-full">
                    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md h-full">
                      <div className="relative aspect-[4/3] bg-slate-100">
                        {f.cover_image_url && (
                          <Image
                            src={f.cover_image_url}
                            alt={f.title}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-5 min-h-[64px]">
                        <div className="text-sm font-semibold leading-snug text-slate-900">{f.title}</div>
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
        <section className="px-5 py-12 border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-[180px_1fr] items-start">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm h-40 md:h-44">
                <Image
                  src={artisan.photo_url || "/images/about.jpg"}
                  alt="Artisan menuisier"
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#d1d2d4]">{artisan.title}</h2>
                {artisan.bio && (
                  <p className="mt-2 text-[#d1d2d4]">{artisan.bio}</p>
                )}
                {artisan.bullets && artisan.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 text-[#c5d5df]">
                    {artisan.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 bg-white rounded-sm" />
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
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
      <section className="px-5 py-12 border-t border-white/10 bg-transparent" id="contact">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold text-[#d1d2d4]">Contact</h2>
          <p className="mt-1 text-[#d1d2d4]">
            Téléphone :{" "}
            <a className="underline text-[#c5d5df] hover:text-white transition" href={`tel:${site.phone.replaceAll(" ", "")}`}>
              {site.phone}
            </a>{" "}
            • Email :{" "}
            <a className="underline text-[#c5d5df] hover:text-white transition" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ContactForm />
        </div>
      </section>

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
            href="#contact"
            className="flex-1 rounded-xl border border-white/20 py-3 text-center font-medium text-[#d1d2d4]"
          >
            Devis
          </a>
        </div>
      </div>

      <div className="h-20 md:h-0" />

      <footer className="bg-[#111e26] text-slate-300">
        <div className="mx-auto max-w-6xl grid gap-8 px-5 py-12 text-sm md:grid-cols-3 md:items-start">
          <div>
            <div className="font-semibold text-white">{site.businessName}</div>
            <div className="mt-2 text-slate-400">Artisan menuisier à {site.city}</div>
          </div>
          <div>
            <div className="pl-6 font-semibold text-white">Zone d&apos;intervention</div>
            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
              <span>{site.serviceArea}</span>
            </div>
          </div>
          <div>
            <div className="pl-6 font-semibold text-white">Contact</div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338a16.128 16.128 0 0 1 4.004-1.582c.518-.124.99.21 1.09.726l.527 2.803a1.125 1.125 0 0 1-.577 1.194l-1.397.698a13.515 13.515 0 0 0 5.978 5.978l.698-1.397a1.125 1.125 0 0 1 1.194-.577l2.803.527c.516.1.85.572.726 1.09a16.128 16.128 0 0 1-1.582 4.004C17.25 20.818 14.763 22 12 22 6.477 22 2 17.523 2 12c0-2.763 1.182-5.25 3.338-6.662z" />
                </svg>
                <a className="text-slate-300 hover:text-white transition" href={`tel:${site.phone.replaceAll(" ", "")}`}>
                  {site.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
                </svg>
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
