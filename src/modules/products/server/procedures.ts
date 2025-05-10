import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        // minPrice: z.string().nullable().optional(),
        // maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      // if (input.minPrice) {
      //   where.price = {
      //     greater_than_equal: input.minPrice,
      //   };
      // }
      // if (input.maxPrice) {
      //   where.price = {
      //     less_than_equal: input.maxPrice,
      //   };
      // }

      if (input.category) {
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })), // bcz of 'depth: 1' we are confident 'doc' will be a type of 'Category'
        }));
        const subcategoriesSlug = [];
        const parentCategory = formattedData[0];
        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlug],
          };
        }
      }

      const data = await ctx.payload.find({
        collection: "products",
        depth: 1, // 1 = populate "category", "images"
        where,
      });

      return data;
    }),
});
