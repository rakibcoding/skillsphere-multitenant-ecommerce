import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Footer } from "./footer";
import { Navbar } from "./Navbar";
import { SearchFilter } from "./search-filter";
import { Category } from "@/payload-types";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}
const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    pagination: false,
    depth: 1, // 1 = only top level categories, 2 = all categories
    where: { parent: { exists: false } },
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })), // bcz of 'depth: 1' we are confident 'doc' will be a type of 'Category'
  }));
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <SearchFilter data={formattedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
