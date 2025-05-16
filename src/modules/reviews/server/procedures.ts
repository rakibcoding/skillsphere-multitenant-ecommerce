import z from "zod";
import { createTRPCRouter, protectProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
  getOne: protectProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      const reviewsData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: product.id,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });
      const review = reviewsData.docs[0];

      if (!review) return null;

      return review;
    }),

  create: protectProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z
          .number()
          .min(1, { message: "Rating must be at least 1" })
          .max(5, { message: "Rating cannot exceed 5" }),
        description: z
          .string()
          .min(1, { message: "Description is required" })
          .max(500, { message: "Description cannot exceed 500 characters" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewsData = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });
      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Yo0u have already reviewed this product",
        });
      }
      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });
      return review;
    }),
  update: protectProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z
          .number()
          .min(1, { message: "Rating must be at least 1" })
          .max(5, { message: "Rating cannot exceed 5" }),
        description: z
          .string()
          .min(1, { message: "Description is required" })
          .max(500, { message: "Description cannot exceed 500 characters" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.payload.findByID({
        depth: 0,
        collection: "reviews",
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      const updatedReview = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });
      return updatedReview;
    }),
});
