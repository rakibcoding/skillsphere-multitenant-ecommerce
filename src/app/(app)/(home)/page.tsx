"use client";
import { useTRPC } from "@/trpc/client";
// import { getQueryClient, trpc } from "@/trpc/server";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  // const queryClient = getQueryClient();

  //Server side query
  // const categories = queryClient.fetchQuery(
  //   trpc.categories.getMany.queryOptions()
  // );
  //Client side query
  const categories = useQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="">
      <h2>Home{JSON.stringify(categories.data, null, 2)}</h2>
    </div>
  );
}
