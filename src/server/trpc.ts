import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Create context for tRPC requests
export const createContext = () => ({
  // Add any context data here (e.g., user session)
});
