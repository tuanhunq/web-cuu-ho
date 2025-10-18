// Định vị / khoảng cách GPS helpers

export function haversineDistance(a, b) {
  // a, b: { lat, lon }
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371e3; // meters
  const phi1 = toRad(a.lat);
  const phi2 = toRad(b.lat);
  const dPhi = toRad(b.lat - a.lat);
  const dLambda = toRad(b.lon - a.lon);

  const sa = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return R * c; // meters
}

export function parseCoords(str) {
  // accept 'lat,lon' or object
  if (!str) return null;
  if (typeof str === 'object' && str.lat != null && str.lon != null) return str;
  const parts = String(str).split(',').map(s => s.trim());
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
}

