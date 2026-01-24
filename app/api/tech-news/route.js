// Tech-news API: fetches live technology headlines when `NEWS_API_KEY` is configured.
// Implements a simple in-memory cache with configurable TTL to avoid provider rate limits.

let cache = { ts: 0, ttl: 60000, articles: [] };

export async function GET() {
  const fallback = [
    {
      title: 'New JavaScript Runtime Optimizes Startup',
      description: 'A new JS runtime focuses on instant startup and small memory footprint for serverless workloads.',
      url: 'https://example.com/article1',
      urlToImage: '/projects/chatapp.png',
    },
    {
      title: 'TypeScript Improves Inference',
      description: 'TypeScript introduces improved type inference and faster incremental builds.',
      url: 'https://example.com/article2',
      urlToImage: '/projects/portfolio.png',
    },
    {
      title: 'CSS Subgrid Gains Traction',
      description: 'Subgrid adoption is rising as browsers finalize implementations.',
      url: 'https://example.com/article3',
      urlToImage: '/projects/chatapp.png',
    },
  ];

  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const ttlEnv = Number(process.env.NEWS_CACHE_TTL_MS || process.env.NEXT_PUBLIC_NEWS_POLL_MS || 60000);
  cache.ttl = Number.isFinite(ttlEnv) && ttlEnv > 0 ? ttlEnv : 60000;

  // Serve from cache if fresh
  if (Date.now() - cache.ts < cache.ttl && Array.isArray(cache.articles) && cache.articles.length > 0) {
    return new Response(JSON.stringify(cache.articles), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (!NEWS_API_KEY) {
    // No API key — return fallback static articles
    return new Response(JSON.stringify(fallback), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=9&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('News API error', res.status, text);
      // keep using fallback or previous cache
      const out = cache.articles.length ? cache.articles : fallback;
      return new Response(JSON.stringify(out), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const payload = await res.json();
    if (!payload || !Array.isArray(payload.articles)) {
      console.error('Unexpected news payload', payload);
      const out = cache.articles.length ? cache.articles : fallback;
      return new Response(JSON.stringify(out), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const articles = payload.articles.map(a => ({
      title: a.title || 'No title',
      description: a.description || a.content || '',
      url: a.url || '#',
      urlToImage: a.urlToImage || '/placeholder.png',
    }));

    cache = { ts: Date.now(), ttl: cache.ttl, articles };
    return new Response(JSON.stringify(articles), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Failed to fetch tech news', err);
    const out = cache.articles.length ? cache.articles : fallback;
    return new Response(JSON.stringify(out), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
