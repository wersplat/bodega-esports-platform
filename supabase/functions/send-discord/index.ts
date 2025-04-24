// supabase/functions/send-discord/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { content } = await req.json();

    if (!content || content.trim() === "") {
      return new Response("Content cannot be empty", { status: 400 });
    }

    const webhook = Deno.env.get("DISCORD_WEBHOOK_URL");

    if (!webhook) {
      return new Response("Webhook not configured", { status: 500 });
    }

    const discordRes = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      const errorText = await discordRes.text();
      return new Response(`Discord error: ${errorText}`, { status: 500 });
    }

    return new Response("Message sent to Discord!", { status: 200 });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
