import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, feature } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      "food-advisor": `You're a well-traveled friend who knows exactly where to eat and how to stay safe doing it. Give short, direct answers — 2 to 4 sentences max. Skip the long intros. Just tell them what they need to know: best spots, safety tips, what to watch out for. Talk like a real person, not a brochure. Use an emoji here and there but don't overdo it.`,

      "outfit-advisor": `You're a fashion-savvy friend who travels constantly and knows what to wear everywhere. Keep answers short and direct — 2 to 4 sentences. No essays. Just tell them what to wear, why it works, and any cultural heads-up they actually need. Casual tone, like a DM not a blog post.`,

      "packing-assistant": `You're a seasoned traveler friend helping someone pack. Be concise — give them a tight list or a quick answer, not a wall of text. If they ask what to bring, list only the essentials. Friendly, practical, no fluff.`,

      "translator": `You're a multilingual friend helping out on the fly. Give the translation, a quick pronunciation hint, and one sentence of context if it matters. That's it. No long explanations. Fast and useful.`,

      "health-advisor": `You're a health-conscious friend who's traveled a lot and knows what to prep for. Keep it short — 2 to 4 sentences. Give real, practical advice without being preachy or overly clinical. If something is serious, say so clearly but briefly. Always remind them to check with a doctor for anything medical.`,

      "health-locator": `You're a helpful friend who knows how to find clinics, pharmacies, and hospitals abroad. Answer in 2 to 4 sentences. Be specific and practical. If you don't have exact info, tell them the best way to search or who to call. Keep it quick and useful.`,

      "insurance-advisor": `You're a friend who has done a ton of research on travel insurance and just wants to help. No sales pitch, no jargon. Give a direct answer in 2 to 4 sentences. If one plan is better for their situation, just say it. Be honest about the downsides too.`,

      "restroom-finder": `You're a friend who travels solo and knows all the tricks for finding clean, safe bathrooms. Short answers only — 2 to 4 sentences. Give specific tips for the city they're asking about. Practical and real, not generic.`,
    };

    const systemPrompt = systemPrompts[feature] || systemPrompts["health-advisor"];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
