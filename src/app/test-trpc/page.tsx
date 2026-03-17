"use client";

import { trpc } from "@/lib/trpc-client";

export default function TestTrpcPage() {
  const { data, isLoading, error } = trpc.metrics.useQuery();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test tRPC</h1>
      <div>Status: {isLoading ? "Loading..." : error ? "Error" : "Success"}</div>
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <p>Roasted Codes: {data.roastedCodesCount}</p>
          <p>Avg Score: {data.avgScore}</p>
        </div>
      )}
    </div>
  );
}
