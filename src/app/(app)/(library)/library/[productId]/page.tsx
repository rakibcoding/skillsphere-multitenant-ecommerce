import { ProductView } from "@/modules/library/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
interface Props {
  params: Promise<{
    productId: string;
  }>;
}
const Library = async ({ params }: Props) => {
  const { productId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />;
    </HydrationBoundary>
  );
};

export default Library;
