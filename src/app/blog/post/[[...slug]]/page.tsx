import { BlogPostContent } from "@/components/blog/BlogPostContent";

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function BlogPostPage() {
  return <BlogPostContent />;
}
