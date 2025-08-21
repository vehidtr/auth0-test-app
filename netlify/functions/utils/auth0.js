
export function getCorsHeaders(origin) {
  const allowed = (process.env.REACT_APP_BASE_URL || "")
    .split(",")
    .map((o) => o.trim());

  if (origin && allowed.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };
  }

  return {
    "Access-Control-Allow-Origin": "null",
  };
}

// Handle OPTIONS preflight
export function handleOptions(event) {
  const headers = getCorsHeaders(event.headers.origin);
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "Preflight OK",
    };
  }
  return null;
}

export async function getManagementToken() {
  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || "Failed to get management token");
  }

  return data.access_token;
}
