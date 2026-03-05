"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">M.A Rénov — Admin</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-900 transition"
        >
          Déconnexion
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">Gestion du contenu du site</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="/admin/services"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="text-sm font-semibold text-slate-900">Services</div>
            <div className="mt-1 text-sm text-slate-500">Créer, modifier, supprimer des services</div>
          </a>

          <a
            href="/admin/realisations"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="text-sm font-semibold text-slate-900">Réalisations</div>
            <div className="mt-1 text-sm text-slate-500">Gérer les familles et leurs photos</div>
          </a>

          <a
            href="/admin/spotlight"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="text-sm font-semibold text-slate-900">À la une</div>
            <div className="mt-1 text-sm text-slate-500">Bloc promotionnel — visible ou masqué</div>
          </a>

          <a
            href="/admin/artisan"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="text-sm font-semibold text-slate-900">Présentation artisan</div>
            <div className="mt-1 text-sm text-slate-500">Photo, bio, points forts</div>
          </a>
        </div>
      </main>
    </div>
  );
}
