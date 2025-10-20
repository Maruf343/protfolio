export async function GET() {
  const baseUrl = 'https://yourdomain.com';
  const routes = ['/', '/#projects', '/#about-me', '/#contact'];
  const urls = routes.map((r) => `<url><loc>${baseUrl}${r}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
