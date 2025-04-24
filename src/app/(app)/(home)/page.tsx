import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // 1 = only top level categories, 2 = all categories
    where: { parent: { exists: false } },
  });
  console.log(data);

  return <div className="">{JSON.stringify(data, null, 2)}</div>;
}
