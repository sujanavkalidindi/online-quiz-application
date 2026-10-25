export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Request body contains invalid JSON' });
  if (err.type === 'entity.too.large') return res.status(413).json({ success: false, message: 'Request body is too large' });
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource ID' });
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'A record with these details already exists' });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
}
