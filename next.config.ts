import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["postgres", "drizzle-orm", "@prisma/client"],
	experimental: {
		optimizePackageImports: ["@google/generative-ai"],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
