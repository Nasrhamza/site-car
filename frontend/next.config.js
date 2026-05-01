const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

const remotePatterns = [
  {
    protocol: "https",
    hostname: "images.unsplash.com"
  },
  {
    protocol: "https",
    hostname: "example.com"
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "5000"
  }
];

if (apiUrl) {
  try {
    const parsed = new URL(apiUrl);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {})
    });
  } catch (error) {
    console.warn("NEXT_PUBLIC_API_URL invalide pour next/image:", error);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/guide",
        permanent: true
      },
      {
        source: "/blog/:slug",
        destination: "/guide",
        permanent: true
      },
      {
        source: "/financement",
        destination: "/guide/achat-securise",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
