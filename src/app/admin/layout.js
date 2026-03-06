"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Déconnexion automatique après 15 minutes d'inactivité
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.push("/admin/login");
    }

    function resetTimer() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT_MS);
    }

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    // Démarrer le timer dès l'entrée dans l'admin
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [router]);

  return <div className="text-slate-900">{children}</div>;
}
