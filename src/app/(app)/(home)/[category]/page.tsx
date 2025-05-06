interface Props {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;
  return <div>CategoryPage: {category}</div>;
};

export default CategoryPage;
