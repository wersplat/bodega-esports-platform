import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://81c8eb05a57a537c8a488ed981d59df3@o4509330775277568.ingest.us.sentry.io/4509331237699584",
  tracesSampleRate: 1.0,
  debug: true, // TEMP: verify it's running in browser
});
