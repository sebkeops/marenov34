import { getSite, getServices, getProjects, getTestimonials } from "@/lib/data";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export default function Home() {
  const site = getSite();
  const services = getServices();
  const projects = getProjects();
  const testimonials = getTestimonials();

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
        {/* Image de fond */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.heroImage || "/images/hero.jpg"}
            alt=""
            className="h-full w-full object-cover"
          />
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Contenu */}
        <div className="relative px-5 pt-14 pb-10 md:pt-20 md:pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              <span className="opacity-90">{site.city}</span>
              <span className="opacity-50">•</span>
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

      {/* SERVICES */}
      <section className="px-5 py-12 border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold">Nos services</h2>
          <p className="mt-1 text-slate-600">
            Sur-mesure, pose et finitions soignées.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  {/* Image vignette */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Texte */}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{s.title}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {s.desc}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section className="px-5 py-12 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold">Réalisations</h2>
          <p className="mt-1 text-slate-600">
            Une sélection de projets récents (sur-mesure, pose et finitions soignées).
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800 backdrop-blur shadow-sm">
                      {p.city}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-sm font-semibold leading-snug">{p.title}</div>
                    {p.desc ? (
                      <div className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {p.desc}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="px-5 py-12 border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-[180px_1fr] items-start">
            {/* Photo */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.aboutImage || "/images/about.jpg"}
                alt="Artisan menuisier"
                className="h-40 md:h-44 w-full object-cover"
              />
            </div>

            {/* Texte */}
            <div>
              <h2 className="text-xl font-semibold">{site.aboutTitle}</h2>

              {/* Bullets */}
              <ul className="mt-3 space-y-2 text-slate-700">
                {(site.aboutBullets || []).map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-2 h-0.5 w-4 bg-slate-300 rounded-full" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bandeau de confiance */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {site.trust?.map((item, i) => (
              <Reveal key={item} delay={i * 0.05}>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                    ✓
                  </div>
                  <div className="text-sm font-medium text-slate-800">{item}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section className="px-5 py-12 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold">Avis clients</h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-700 border border-slate-200">
            <span className="text-amber-500">★★★★★</span>
            <span>Clients satisfaits</span>
          </div>
          <p className="mt-1 text-slate-600">
            Quelques retours (exemples temporaires, on mettra les vrais au fur et à mesure).
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={`${t.name}-${t.city}`} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-sm text-slate-500">{t.city}</div>
                    </div>

                    <div className="shrink-0 text-sm leading-none">
                      <span className="text-amber-500">{"★".repeat(t.rating)}</span>
                      <span className="text-slate-200">{"★".repeat(5 - t.rating)}</span>
                    </div>
                  </div>

                  <p className="mt-3 flex-grow text-slate-600 italic leading-relaxed">
                    “{t.text}”
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT (placeholder) */}
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

      {/* Espace pour ne pas masquer le bas de page */}
      <div className="h-20 md:h-0" />

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-6xl grid gap-8 px-5 py-12 text-sm md:grid-cols-3">

          {/* Colonne 1 */}
          <div>
            <div className="font-semibold text-white">
              {site.businessName}
            </div>
            <div className="mt-2 text-slate-400">
              Artisan menuisier à {site.city}
            </div>
          </div>

          {/* Colonne 2 */}
          <div>
            <div className="font-semibold text-white">
              Zone d’intervention
            </div>
            <div className="mt-2 text-slate-400">
              {site.serviceArea}
            </div>
          </div>

          {/* Colonne 3 */}
          <div>
            <div className="font-semibold text-white">
              Contact
            </div>
            <div className="mt-2">
              <a
                className="text-slate-300 hover:text-white transition"
                href={`tel:${site.phone.replaceAll(" ", "")}`}
              >
                {site.phone}
              </a>
            </div>
          </div>

        </div>

        {/* Ligne du bas */}
        <div className="mx-auto max-w-6xl border-t border-slate-800 px-5 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {site.businessName}. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}