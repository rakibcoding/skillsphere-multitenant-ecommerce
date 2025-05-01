import z from "zod";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.payload.auth({ headers });
    return session;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
  register: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        username: z
          .string()
          .min(3, "Username must be at least 3 character")
          .max(63, "Username must be at least 63 character")
          .regex(
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
            "Username can only contain lowercase letters, numbers and dashes.It must start and end with a lowercase letter or number"
          )
          .refine(
            (val) => !val.includes("--"),
            "Username cannot contain two consecutive dashes"
          )
          .transform((val) => val.toLowerCase()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username, //This will be hashed in the database
        },
      });
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // sameSite: "none",
        // domain:
        //TODO: Ensure cross-domain cookie sharing
      });
    }),
  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // sameSite: "none",
        // domain:
        //TODO: Ensure cross-domain cookie sharing
      });
      return data;
    }),
});
