import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["postgres", "drizzle-orm", "@prisma/client"],
};

export default nextConfig;
