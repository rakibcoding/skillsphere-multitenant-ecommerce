"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  return (
    <div className="">
      <h2>Home</h2>
      {JSON.stringify(data?.user, null, 2)}
    </div>
  );
}
