/**
 * auth.js
 * Middleware de autenticación JWT usando solo Node.js crypto.
 * No usa librerías externas.
 */

const crypto = require("crypto");

const SECRET_KEY = process.env.JWT_SECRET || "nexus-analytics-secret-key-2026";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Genera un token JWT simple usando HMAC
 */
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY,
  })).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

/**
 * Verifica un token JWT
 */
function verifyToken(token) {
  try {
    const [header, body, signature] = token.split(".");
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid signature" };
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString());

    if (Date.now() > payload.exp) {
      return { valid: false, error: "Token expired" };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: "Invalid token" };
  }
}

/**
 * Middleware para el servidor HTTP
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "No token provided" }));
    return;
  }

  const result = verifyToken(token);

  if (!result.valid) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: result.error }));
    return;
  }

  req.user = result.payload;
  next();
}

module.exports = { generateToken, verifyToken, authMiddleware };
