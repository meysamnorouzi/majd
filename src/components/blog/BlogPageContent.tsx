"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { fetchPostsClient, type BlogPost } from "@/lib/wordpress/client";

export function BlogPageContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPostsClient(24);
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) setError("بارگذاری مقالات انجام نشد.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20">
      <Container>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
