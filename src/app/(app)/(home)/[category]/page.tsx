import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/products/product-list";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;
  // const products = await caller.products.getMany();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CategoryPage;
