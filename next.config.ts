import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
