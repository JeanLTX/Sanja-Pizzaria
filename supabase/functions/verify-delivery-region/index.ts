import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED_ORIGINS = new Set([
  "https://sanjapizzaria.com.br",
  "https://www.sanjapizzaria.com.br",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

function responseJson(status: number, body: Record<string, unknown>, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders,
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
    },
  });
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";

  if (!ALLOWED_ORIGINS.has(origin)) {
    return new Response(JSON.stringify({ error: "Origin não autorizado." }), {
      status: 403,
      headers: jsonHeaders,
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      },
    });
  }

  if (req.method !== "POST") {
    return responseJson(405, { error: "Método não permitido." }, origin);
  }

  const apiKey = req.headers.get("apikey") ?? "";
  let publishableKeys: Record<string, string> = {};
  try {
    publishableKeys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
  } catch {
    publishableKeys = {};
  }
  const allowedApiKeys = [
    publishableKeys.default,
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  ].filter(Boolean);
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return responseJson(401, { error: "Chave pública do projeto inválida." }, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return responseJson(400, { error: "Corpo JSON inválido." }, origin);
  }

  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const accuracy = Number(body.accuracy);
  if (
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180
  ) {
    return responseJson(400, { error: "Coordenadas inválidas." }, origin);
  }

  const apiToken = Deno.env.get("LOCATIONIQ_API_KEY");
  if (!apiToken) {
    return responseJson(503, {
      error: "A chave do LocationIQ ainda não foi configurada no Supabase.",
      code: "LOCATIONIQ_SECRET_MISSING",
    }, origin);
  }

  const url = new URL("https://us1.locationiq.com/v1/reverse");
  url.searchParams.set("key", apiToken);
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "pt-BR");

  let geo: Record<string, unknown>;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    let response: Response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const status = response.status;
      return responseJson(status === 429 ? 429 : 502, {
        error: status === 429
          ? "O limite de consultas do serviço foi atingido. Tente novamente."
          : "O serviço de localização não conseguiu consultar este ponto.",
        code: "LOCATIONIQ_REQUEST_FAILED",
      }, origin);
    }
    geo = await response.json();
  } catch (error) {
    return responseJson(502, {
      error: error instanceof DOMException && error.name === "AbortError"
        ? "A consulta da localização demorou demais. Tente novamente."
        : "Não foi possível consultar o serviço de localização.",
      code: "LOCATIONIQ_UNAVAILABLE",
    }, origin);
  }

  const address = (geo.address && typeof geo.address === "object"
    ? geo.address
    : {}) as Record<string, unknown>;

  const cityContext = new Set([
    normalize(address.city),
    normalize(address.town),
    normalize(address.municipality),
    normalize(address.county),
    normalize(address.state_district),
  ].filter(Boolean));

  const candidateFields = [
    ["neighbourhood", address.neighbourhood],
    ["suburb", address.suburb],
    ["quarter", address.quarter],
    ["residential", address.residential],
    ["hamlet", address.hamlet],
    ["village", address.village],
    ["locality", address.locality],
    ["city_district", address.city_district],
  ] as const;

  const seen = new Set<string>();
  const regionCandidates: Array<{ name: string; source: string }> = [];
  for (const [source, rawName] of candidateFields) {
    const name = String(rawName ?? "").trim();
    const normalized = normalize(name);
    if (!name || !normalized || cityContext.has(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);
    regionCandidates.push({ name, source });
  }

  const road = String(address.road ?? address.pedestrian ?? address.footway ?? "").trim();
  const houseNumber = String(address.house_number ?? "").trim();
  return responseJson(200, {
    ok: true,
    displayName: String(geo.display_name ?? ""),
    road,
    houseNumber,
    postcode: String(address.postcode ?? ""),
    city: String(address.city ?? address.town ?? address.village ?? address.municipality ?? ""),
    state: String(address.state ?? ""),
    regionCandidates,
    accuracy: Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : null,
    coordinates: { latitude, longitude },
  }, origin);
});
