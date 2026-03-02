import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  isVisible: boolean;
}

const BlogPostCard = ({ post, index, isVisible }: BlogPostCardProps) => {
  return (
    <div
      className={`group transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${200 + index * 100}ms` }}
    >
      <div className="h-full bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300">
        {/* Date */}
        <p className="text-slate-500 text-sm font-mono mb-3">
          {format(new Date(post.published_at || new Date()), "MMMM dd, yyyy")}
        </p>

        {/* Title */}
        <h3 className="text-xl font-semibold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Summary */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.summary}
        </p>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read more link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium"
        >
          Read more
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="h-full bg-slate-900/50 border border-slate-800 rounded-xl p-6">
    <div className="h-4 w-24 bg-slate-800 rounded mb-3 animate-pulse" />
    <div className="h-6 w-3/4 bg-slate-800 rounded mb-3 animate-pulse" />
    <div className="space-y-2 mb-4">
      <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
      <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-slate-800 rounded-lg animate-pulse" />
      <div className="h-6 w-16 bg-slate-800 rounded-lg animate-pulse" />
    </div>
  </div>
);

export default function BlogSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await apiRequest("/api/blog?limit=3");
      return response as { success: boolean; posts: BlogPost[] };
    },
  });

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-32 bg-slate-900 relative overflow-hidden"
    >
      {/* Subtle gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section header */}
        <div
          className={`max-w-3xl mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-blue-400 font-mono text-sm mb-4 tracking-wider">
            Blog
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Latest Articles
          </h2>
          <p className="text-slate-400 text-lg">
            Thoughts, tutorials, and insights from my journey in tech and
            entrepreneurship.
          </p>
        </div>

        {/* Blog posts grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-slate-500">Failed to load blog posts</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.posts?.length ? (
                data.posts.map((post: BlogPost, index: number) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    isVisible={isVisible}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <p className="text-slate-500">
                    No blog posts yet. Check back soon!
                  </p>
                </div>
              )}
            </div>

            {data?.posts?.length ? (
              <div
                className={`mt-12 text-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  View All Posts
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
