import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' wss: ws:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  /* config options here */
  experimental: {
    // Enable React Compiler when available
  },
  webpack: (config, { isServer }) => {
    // Suppress warnings for optional MongoDB dependencies
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        kerberos: "commonjs kerberos",
        "@mongodb-js/zstd": "commonjs @mongodb-js/zstd",
        "@aws-sdk/credential-providers":
          "commonjs @aws-sdk/credential-providers",
        "gcp-metadata": "commonjs gcp-metadata",
        snappy: "commonjs snappy",
        socks: "commonjs socks",
        aws4: "commonjs aws4",
        "mongodb-client-encryption": "commonjs mongodb-client-encryption",
      });
    }
    return config;
  },
};

export default nextConfig;
