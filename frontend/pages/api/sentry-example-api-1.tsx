import type { NextApiRequest, NextApiResponse } from 'next';

// Custom error class for Sentry testing
class SentryExampleAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// A faulty API route to test Sentry's error monitoring
export default function handler(
  _req: NextApiRequest,
  _res: NextApiResponse
) {
  throw new SentryExampleAPIError("This error is raised on the frontend called by the example page.");
  // Note: The line below is unreachable due to the throw above
  // res.status(200).json({ name: "John Doe" });
}