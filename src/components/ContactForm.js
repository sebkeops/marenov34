"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // V1 : pas d’envoi, juste redirection "pro"
    // Plus tard (V1.2/V2), on enverra ces données à une API / Supabase
    router.push("/merci");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Nom</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 bg-[#d1d2d4] px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Téléphone</label>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 bg-[#d1d2d4] px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
            placeholder="06 …"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Votre projet</label>
          <textarea
            name="message"
            required
            rows={5}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-[#d1d2d4] px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
            placeholder="Ex : dressing sur mesure, dimensions, ville, délai…"
          />
        </div>

        <div className="mt-4 flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto rounded-xl bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </div>

        <p className="text-sm text-slate-500">
          V1 : formulaire en cours de mise en place (envoi automatisé à venir).
        </p>
      </div>
    </form>
  );
}