import { timingSafeEqual } from 'node:crypto';

export function requireAdminKey(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return res.status(503).json({ success: false, message: 'Management API is not configured. Set ADMIN_API_KEY in backend/.env.' });
  }

  const provided = req.get('x-admin-key') || '';
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  const matches = expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
  if (!matches) return res.status(401).json({ success: false, message: 'A valid management API key is required.' });
  next();
}
