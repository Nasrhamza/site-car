import { redirect } from "next/navigation";
import { CATEGORY_SLUGS } from "@/lib/company";

export default function CategoryPage({
  params
}: {
  params: { slug: string };
}) {
  const category = CATEGORY_SLUGS[params.slug];

  if (!category) {
    redirect("/catalogue");
  }

  redirect(`/catalogue?category=${encodeURIComponent(category)}`);
}
