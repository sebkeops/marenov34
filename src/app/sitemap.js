import { createServerClient } from "@/lib/supabase-server";

const BASE_URL = "https://marenov34.vercel.app";

export default async function sitemap() {
  const supabase = createServerClient();
  const { data: families } = await supabase
    .from("families")
    .select("id, updated_at")
    .order("order", { ascending: true });

  const familyUrls = (families || []).map((f) => ({
    url: `${BASE_URL}/realisations/${f.id}`,
    lastModified: f.updated_at ? new Date(f.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...familyUrls,
  ];
}
