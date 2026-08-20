import { Request, Response, NextFunction } from 'express';

// In-memory tracker for suspicious IPs and blocked attempts
interface ThreatEntry {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const threatMap = new Map<string, ThreatEntry>();

// Suspicious URL substrings that automated exploit scanners use
const MALICIOUS_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.aws/i,
  /wp-admin/i,
  /wp-login/i,
  /phpmyadmin/i,
  /etc\/passwd/i,
  /\.\.\//, // Directory traversal
  /\.\.\\/, // Windows directory traversal
  /<script/i,
  /union\s+select/i,
  /exec\s*\(/i,
  /eval\s*\(/i,
];

/**
 * Recursively removes prototype pollution keys and sanitizes malicious script tags
 */
function sanitizeObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      // Strip dangerous HTML/script tags from incoming strings
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '');
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    cleanObj[key] = sanitizeObject(value);
  }
  return cleanObj;
}

/**
 * In-App Web Application Firewall (WAF) & Security Shield
 */
export const securityShield = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // 1. Check if IP is currently under temporary security ban
  const threat = threatMap.get(clientIp);
  if (threat && threat.blockedUntil && threat.blockedUntil > now) {
    const remainingSec = Math.ceil((threat.blockedUntil - now) / 1000);
    res.status(429).json({
      success: false,
      message: `Access temporarily blocked due to detected security violations. Try again in ${remainingSec}s.`,
    });
    return;
  }

  // 2. Scan URL path and query string for malicious exploit payloads
  let fullUrl = req.originalUrl || req.url;
  try {
    fullUrl = decodeURIComponent(fullUrl);
  } catch {
    // If malformed URI encoding, block immediately
    res.status(400).json({ success: false, message: 'Malformed URI encoding.' });
    return;
  }

  const isMalicious = MALICIOUS_PATH_PATTERNS.some((pattern) => pattern.test(fullUrl));

  if (isMalicious) {
    const currentCount = (threat?.count || 0) + 1;
    const isBanned = currentCount >= 3;
    const blockedUntil = isBanned ? now + 15 * 60 * 1000 : undefined; // 15-minute ban

    threatMap.set(clientIp, {
      count: currentCount,
      lastAttempt: now,
      blockedUntil,
    });

    console.warn(`🚨 [SECURITY SHIELD] Blocked exploit probe from IP ${clientIp} on "${fullUrl}". Attempt #${currentCount}`);

    res.status(403).json({
      success: false,
      message: 'Access Denied: Malicious pattern or unauthorized resource request detected.',
    });
    return;
  }

  // 3. Sanitize Request Body, Query, and Params against Prototype Pollution & XSS
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  // 4. Clean up stale entries every 1 hour
  if (threatMap.size > 5000) {
    for (const [ip, data] of threatMap.entries()) {
      if (now - data.lastAttempt > 3600000) {
        threatMap.delete(ip);
      }
    }
  }

  next();
};
