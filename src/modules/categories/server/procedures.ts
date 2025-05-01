import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ctx}) => {
    const data = await ctx.payload.find({
      collection: "categories",
      pagination: false,
      depth: 1, // 1 = only top level categories, 2 = all categories
      where: { parent: { exists: false } },
      sort: "name",
    });
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
        subcategories: undefined,
      })), // bcz of 'depth: 1' we are confident 'doc' will be a type of 'Category'
    }));

    return formattedData;
  }),
});
