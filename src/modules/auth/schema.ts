import z from "zod";
export const registerSchema = z.object({
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
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
