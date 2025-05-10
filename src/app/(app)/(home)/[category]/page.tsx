import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/products/product-list";
import { Suspense } from "react";
import { ProductFilters } from "@/modules/products/ui/products/product-filters";
import { loadProductFilters } from "@/modules/products/hooks/use-product-filter";

interface Props {
  params: Promise<{
    category: string;
  }>;
  SearchParams: Promise<SearchParams>;
}

const CategoryPage = async ({ params, SearchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(SearchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category, ...filters })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:px-2 py-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12 ">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default CategoryPage;
