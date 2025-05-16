/* eslint-env node */

const startTime = Date.now();

export default function handler(req, res) {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage().rss; // in bytes
  const env = process.env.NODE_ENV || 'development';

  res.status(200).json({
    status: 'ok',
    uptime: `${uptimeSeconds}s`,
    memoryMB: Math.round(memoryUsage / 1024 / 1024), // convert to MB
    env,
  });
}
