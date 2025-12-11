export const config = { runtime: "edge" };

export default async function handler(req) {
  // اسمح بالـ preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-token",
      },
    });
  }

  try {
    // ناخد body من الطلب كـ نصوصي
    const body = await req.text();

    // ناخد التوكن من headers اللي هيبعتها العميل
    const token = req.headers.get("x-api-token");
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing x-api-token header" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // رابط Supabase Function المخفي
    const SUPABASE_URL = "https://qttjklcdhofdawomaafd.supabase.co/functions/v1/chat";

    // نرسل request لـ Supabase
    const response = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": token,
      },
      body: body,
    });

    const text = await response.text();

    // نرجع response للعميل مع CORS
    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-token",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
