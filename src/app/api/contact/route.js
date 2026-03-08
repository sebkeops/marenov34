import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { name, phone, message } = await req.json();

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return Response.json({ error: "Champs manquants." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Contact Site <contact@marenov34.fr>",
    to: "ste.marenov@gmail.com",
    subject: `Nouveau message de ${name}`,
    text: `Nom : ${name}\nTéléphone : ${phone}\n\nMessage :\n${message}`,
  });

  if (error) {
    console.error("[contact] Resend error:", JSON.stringify(error));
    return Response.json({ error: "Erreur lors de l'envoi.", detail: error }, { status: 500 });
  }

  return Response.json({ ok: true });
}
