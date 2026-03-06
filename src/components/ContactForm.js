"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const PHONE_REGEX = /^(\+33|0033|0)[1-9]([ .-]?\d{2}){4}$/;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = Object.fromEntries(new FormData(e.target));

    if (!PHONE_REGEX.test(data.phone.replace(/\s/g, ""))) {
      setError("Numéro de téléphone invalide. Ex : 06 59 02 90 28");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError("Une erreur est survenue. Veuillez réessayer ou nous appeler directement.");
      setLoading(false);
      return;
    }

    e.target.reset();
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 10000);
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

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && (
          <p className="text-sm text-green-600 font-medium">
            Votre message a bien été envoyé. Nous vous recontactons rapidement !
          </p>
        )}

        <div className="mt-4 flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto rounded-xl bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? "Envoi en cours…" : "Envoyer"}
          </button>
        </div>
      </div>
    </form>
  );
}
