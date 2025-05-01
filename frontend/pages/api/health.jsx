let startTime = Date.now();

export default function handler(req, res) {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage().rss; // in bytes

  res.status(200).json({
    status: 'ok',
    uptime: `${uptimeSeconds}s`,
    memoryMB: Math.round(memoryUsage / 1024 / 1024), // convert to MB
  });
}
