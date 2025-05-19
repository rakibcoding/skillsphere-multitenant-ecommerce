import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}
export const generateAuthCookies = async ({ prefix, value }: Props) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`, // "payload-token" by default
    value: value,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    secure: process.env.NODE_ENV === "production",
  });
};
