export const config = { runtime: "edge" };

export default async function handler(req) {
  const body = await req.text(); // ناخد البودي زي ما هو
  const headers = new Headers(req.headers);

  // نوجه للـ Supabase Function
  const url = "https://qttjklcdhofdawomaafd.supabase.co/functions/v1/chat";

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  // نرجع الرد كما هو
  return new Response(response.body, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    }
  });
}
