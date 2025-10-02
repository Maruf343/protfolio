export async function GET() {
  try {
    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") {
      return new Response(JSON.stringify({ error: "Failed to fetch news" }), { status: 500 });
    }

    return new Response(JSON.stringify(data.articles), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
