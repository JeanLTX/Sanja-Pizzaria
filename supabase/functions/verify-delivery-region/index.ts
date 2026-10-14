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


type Coordinates = { latitude: number; longitude: number; label: string; approximate?: boolean };
const BRAZOPOLIS_REFERENCE = { latitude: -22.4743, longitude: -45.6166 };
const SANJA_ORIGIN_FALLBACK = { latitude: -22.4735524, longitude: -45.6184710 };
const SANJA_ORIGIN_QUERY = "Pra\u00e7a Sagrados Cora\u00e7\u00f5es, 56 - Braz\u00f3polis - MG";
let sanjaOriginPromise: Promise<Coordinates> | null = null;

function distanceKmBetween(a: Coordinates, b: Coordinates): number {
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

let locationIQQueue: Promise<void> = Promise.resolve();
let locationIQLastRequestAt = 0;

function waitForLocationIQRequestSlot(): Promise<void> {
  const next = locationIQQueue.then(async () => {
    const waitMs = Math.max(0, 1050 - (Date.now() - locationIQLastRequestAt));
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    locationIQLastRequestAt = Date.now();
  });
  locationIQQueue = next.catch(() => {});
  return next;
}

async function fetchLocationIQJson(url: URL, timeoutMs = 9000): Promise<any> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await waitForLocationIQRequestSlot();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 429 && attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      continue;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(response.status === 429
        ? "LocationIQ rate limit reached."
        : "LocationIQ could not calculate this location.");
      (error as any).status = response.status;
      throw error;
    }
    return data;
  }
  throw new Error("LocationIQ rate limit reached.");
}

async function searchLocationIQ(apiToken: string, query: string): Promise<any[]> {
  const url = new URL("https://us1.locationiq.com/v1/search");
  url.searchParams.set("key", apiToken);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "br");
  url.searchParams.set("accept-language", "pt-BR");
  const result = await fetchLocationIQJson(url);
  return Array.isArray(result) ? result : [];
}

async function resolveSanjaOrigin(apiToken: string): Promise<Coordinates> {
  if (!sanjaOriginPromise) {
    sanjaOriginPromise = (async () => {
      const cityReference: Coordinates = {
        latitude: BRAZOPOLIS_REFERENCE.latitude,
        longitude: BRAZOPOLIS_REFERENCE.longitude,
        label: "Centro de Brazopolis",
      };

      const queries = [
        SANJA_ORIGIN_QUERY,
        "Pra\u00e7a Sagrados Cora\u00e7\u00f5es, 56, Centro, Braz\u00f3polis, Minas Gerais, Brasil",
      ];

      for (const query of queries) {
        const candidates = await searchLocationIQ(apiToken, query);
        const localCandidates = candidates.filter((candidate) => {
          const latitude = Number(candidate.lat);
          const longitude = Number(candidate.lon);
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
          const label = String(candidate.display_name ?? "");
          const address = candidate.address && typeof candidate.address === "object"
            ? candidate.address as Record<string, unknown>
            : {};
          const locality = normalize([
            label, address.city, address.town, address.municipality,
            address.village, address.county,
          ].join(" "));
          if (!locality.includes("brazopolis") && !locality.includes("brasopolis")) return false;
          return distanceKmBetween(cityReference, { latitude, longitude, label }) <= 6;
        });

        const exactAddress = localCandidates.find((candidate) => {
          const address = candidate.address && typeof candidate.address === "object"
            ? candidate.address as Record<string, unknown>
            : {};
          const road = normalize(address.road ?? address.pedestrian ?? address.footway ?? "");
          const number = normalize(address.house_number ?? "");
          const label = normalize(String(candidate.display_name ?? ""));
          const matchesSquare = (road.includes("praca") && road.includes("sagrado") && road.includes("coracao"))
            || (label.includes("praca") && label.includes("sagrado") && label.includes("coracao"));
          return matchesSquare && number === "56";
        });

        if (exactAddress) {
          return {
            latitude: Number(exactAddress.lat),
            longitude: Number(exactAddress.lon),
            label: String(exactAddress.display_name ?? SANJA_ORIGIN_QUERY),
            approximate: false,
          };
        }

        const plazaPoint = localCandidates.find((candidate) => {
          const label = normalize(String(candidate.display_name ?? ""));
          const address = candidate.address && typeof candidate.address === "object"
            ? candidate.address as Record<string, unknown>
            : {};
          const road = normalize(address.road ?? address.pedestrian ?? address.footway ?? "");
          return (road.includes("praca") && road.includes("sagrado") && road.includes("coracao"))
            || (label.includes("praca") && label.includes("sagrado") && label.includes("coracao"));
        });

        if (plazaPoint) {
          return {
            latitude: Number(plazaPoint.lat),
            longitude: Number(plazaPoint.lon),
            label: "Pra\u00e7a Sagrados Cora\u00e7\u00f5es, Braz\u00f3polis (ponto de refer\u00eancia; n\u00famero 56 n\u00e3o confirmado)",
            approximate: true,
          };
        }
      }

      // LocationIQ can lack the house number in small towns. Use a mapped point in the same square,
      // rather than a generic point elsewhere in the city, and disclose that the origin is approximate.
      return {
        latitude: SANJA_ORIGIN_FALLBACK.latitude,
        longitude: SANJA_ORIGIN_FALLBACK.longitude,
            label: "Pra\u00e7a Sagrados Cora\u00e7\u00f5es, Braz\u00f3polis (ponto de refer\u00eancia; n\u00famero 56 n\u00e3o confirmado)",
        approximate: true,
      };
    })().catch((error) => {
      sanjaOriginPromise = null;
      throw error;
    });
  }
  return await sanjaOriginPromise;
}

async function resolveDestination(
  apiToken: string,
  latitude: number,
  longitude: number,
  hasCoordinates: boolean,
  rawAddress: string,
): Promise<Coordinates> {
  const reference: Coordinates = {
    latitude: BRAZOPOLIS_REFERENCE.latitude,
    longitude: BRAZOPOLIS_REFERENCE.longitude,
    label: "Brazopolis, MG",
  };
  if (hasCoordinates) {
    const coordinates = { latitude, longitude, label: "Localizacao GPS do cliente" };
    if (distanceKmBetween(reference, coordinates) > 60) {
      throw new Error("A localizacao esta muito distante da area de entrega. Confira o GPS ou informe o endereco correto.");
    }
    return coordinates;
  }

  const address = rawAddress.trim();
  if (address.length < 5 || address.length > 250) {
    throw new Error("Informe rua e numero ou envie sua localizacao para calcular a rota.");
  }
  const candidates = await searchLocationIQ(
    apiToken,
    address + ", Brazopolis, Minas Gerais, Brasil",
  );
  const match = candidates.find((candidate) => {
    const lat = Number(candidate.lat);
    const lon = Number(candidate.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
    const displayName = String(candidate.display_name ?? "");
    const addressParts = candidate.address && typeof candidate.address === "object"
      ? candidate.address as Record<string, unknown>
      : {};
    const locality = normalize([
      displayName, addressParts.city, addressParts.town,
      addressParts.municipality, addressParts.village, addressParts.county,
    ].join(" "));
    const street = String(addressParts.road ?? addressParts.pedestrian ?? addressParts.footway ?? "").trim();
    const place = String(
      addressParts.hamlet ?? addressParts.village ?? addressParts.locality
      ?? addressParts.suburb ?? addressParts.neighbourhood ?? "",
    ).trim();
    return (locality.includes("brazopolis") || locality.includes("brasopolis"))
      && (Boolean(street) || Boolean(place))
      && distanceKmBetween(reference, { latitude: lat, longitude: lon, label: displayName }) <= 60;
  });
  if (!match) {
    throw new Error("Nao encontramos uma posicao confiavel para este endereco. Envie sua localizacao atual para calcular o frete.");
  }
  return {
    latitude: Number(match.lat),
    longitude: Number(match.lon),
    label: String(match.display_name ?? address),
  };
}

async function calculateDrivingRoute(
  apiToken: string,
  destination: Coordinates,
): Promise<Record<string, unknown>> {
  const origin = await resolveSanjaOrigin(apiToken);
  const coordinates = origin.longitude + "," + origin.latitude + ";"
    + destination.longitude + "," + destination.latitude;
  const routeUrl = new URL("https://us1.locationiq.com/v1/directions/driving/" + coordinates);
  routeUrl.searchParams.set("key", apiToken);
  routeUrl.searchParams.set("alternatives", "false");
  routeUrl.searchParams.set("steps", "false");
  routeUrl.searchParams.set("overview", "false");
  const data = await fetchLocationIQJson(routeUrl);
  const routes = Array.isArray(data.routes) ? data.routes : [data.routes].filter(Boolean);
  const route = routes[0];
  const distanceMeters = Number(route?.distance ?? route?.legs?.distance);
  const durationSeconds = Number(route?.duration ?? route?.legs?.duration);
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) {
    throw new Error("O LocationIQ nao retornou uma distancia de rota valida.");
  }
  const distanceKm = distanceMeters / 1000;
  const calculatedRoundTripFee = Math.round(distanceKm * 2 * 1.5 * 100) / 100;
  const fee = Math.max(4, calculatedRoundTripFee);
  return {
    ok: true,
    action: "route",
    origin: { label: origin.label, latitude: origin.latitude, longitude: origin.longitude },
    originApproximate: origin.approximate === true,
    destination: { label: destination.label, latitude: destination.latitude, longitude: destination.longitude },
    distanceMeters,
    distanceKm: Math.round(distanceKm * 100) / 100,
    durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
    ratePerKm: 1.5,
    roundTripMultiplier: 2,
    minimumFee: 4,
    calculatedRoundTripFee,
    fee,
  };
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

  const action = String(body.action ?? "reverse");
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const accuracy = Number(body.accuracy);
  const hasCoordinates = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;

  if (action !== "route" && !hasCoordinates) {
    return responseJson(400, { error: "Coordenadas invalidas." }, origin);
  }
  if (action === "route" && !hasCoordinates && !String(body.address ?? "").trim()) {
    return responseJson(400, {
      error: "Informe o endereco ou envie a localizacao atual para calcular a rota.",
      code: "ROUTE_DESTINATION_MISSING",
    }, origin);
  }
  if (action !== "route" && action !== "reverse") {
    return responseJson(400, { error: "Acao invalida." }, origin);
  }

  const apiToken = Deno.env.get("LOCATIONIQ_API_KEY");
  if (!apiToken) {
    return responseJson(503, {
      error: "A chave do LocationIQ ainda nao foi configurada no Supabase.",
      code: "LOCATIONIQ_SECRET_MISSING",
    }, origin);
  }

  if (action === "route") {
    try {
      const destination = await resolveDestination(
        apiToken,
        latitude,
        longitude,
        hasCoordinates,
        String(body.address ?? ""),
      );
      const route = await calculateDrivingRoute(apiToken, destination);
      return responseJson(200, route, origin);
    } catch (error) {
      const status = Number((error as any)?.status);
      const message = error instanceof Error
        ? error.message
        : "Nao foi possivel calcular a rota de entrega.";
      return responseJson(status === 429 ? 429 : 502, {
        error: message,
        code: status === 429 ? "LOCATIONIQ_RATE_LIMIT" : "ROUTE_CALCULATION_FAILED",
      }, origin);
    }
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
    geo = await fetchLocationIQJson(url);
  } catch (error) {
    const status = Number((error as any)?.status);
    return responseJson(status === 429 ? 429 : 502, {
      error: status === 429
        ? "O limite de consultas do serviço foi atingido. Tente novamente."
        : error instanceof DOMException && error.name === "AbortError"
          ? "A consulta da localização demorou demais. Tente novamente."
          : "Não foi possível consultar o serviço de localização.",
      code: status === 429 ? "LOCATIONIQ_RATE_LIMIT" : "LOCATIONIQ_UNAVAILABLE",
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
