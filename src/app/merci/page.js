import Link from "next/link";

export default function MerciPage() {
  return (
    <main className="min-h-screen bg-[#20313c] px-5 py-14 text-[#d1d2d4]">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Merci !</h1>
        <p className="mt-3 text-[#d1d2d4]">
          Votre demande a bien été prise en compte. Nous vous recontactons
          rapidement.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-brand px-5 py-3 font-medium text-white hover:bg-brand-hover transition"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}