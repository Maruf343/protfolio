// Minimal tech-news API for local development
export async function GET() {
  const articles = [
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
    {
      title: 'AI-Assisted Code Review Tools Expand',
      description: 'Code review tools are integrating AI to suggest fixes and explain changes.',
      url: 'https://example.com/article4',
      urlToImage: '/projects/portfolio.png',
    },
    {
      title: 'Edge Functions Become More Powerful',
      description: 'Edge compute platforms add more capabilities for low-latency personalization.',
      url: 'https://example.com/article5',
      urlToImage: '/projects/chatapp.png',
    },
    {
      title: 'WebGPU Ready for Production',
      description: 'WebGPU shipping improvements enable new classes of web visuals and compute workloads.',
      url: 'https://example.com/article6',
      urlToImage: '/projects/portfolio.png',
    },
    {
      title: 'Rust Adoption Continues',
      description: 'More companies adopt Rust for system-level components and performance-critical services.',
      url: 'https://example.com/article7',
      urlToImage: '/projects/chatapp.png',
    }
  ];

  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
