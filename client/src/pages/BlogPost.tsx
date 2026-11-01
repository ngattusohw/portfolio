import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost, BlogMedia } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Components
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { ArrowLeft, Calendar, Tag } from "lucide-react";

const NO_MEDIA: BlogMedia[] = [];

interface MediaElementProps {
  media: BlogMedia;
}

const MediaElement = ({ media }: MediaElementProps) => {
  if (media.media_type === "image") {
    return (
      <div className="my-8 overflow-hidden rounded-lg">
        <img
          src={media.url}
          alt={media.title || "Blog image"}
          className="w-full"
        />
        {media.description && (
          <p className="text-sm text-center mt-2 text-gray-500 italic">
            {media.description}
          </p>
        )}
      </div>
    );
  }

  if (media.media_type === "youtube") {
    return (
      <div className="my-8">
        <div className="aspect-video">
          <iframe
            src={media.url}
            title={media.title || "YouTube video"}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        {media.description && (
          <p className="text-sm text-center mt-2 text-gray-500 italic">
            {media.description}
          </p>
        )}
      </div>
    );
  }

  if (media.media_type === "video") {
    return (
      <div className="my-8">
        <div className="aspect-video">
          <video src={media.url} controls className="w-full h-full" />
        </div>
        {media.description && (
          <p className="text-sm text-center mt-2 text-gray-500 italic">
            {media.description}
          </p>
        )}
      </div>
    );
  }

  if (media.media_type === "vimeo") {
    return (
      <div className="my-8">
        <div className="aspect-video">
          <iframe
            src={media.url}
            title={media.title || "Vimeo video"}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        {media.description && (
          <p className="text-sm text-center mt-2 text-gray-500 italic">
            {media.description}
          </p>
        )}
      </div>
    );
  }

  return null;
};

// Helper function to insert media at appropriate positions in the content
const insertMediaIntoContent = (content: string, media: BlogMedia[]) => {
  if (!media || media.length === 0) return content;

  // Sort media by order
  const sortedMedia = [...media].sort((a, b) => a.order - b.order);

  // Simple implementation - insert a placeholder that we'll use later
  // A more sophisticated implementation would parse the content and insert media properly
  let result = content;
  sortedMedia.forEach((media, index) => {
    const placeholder = `[MEDIA_${index}]`;

    // Insert a placeholder at approximately every 3rd paragraph for demo purposes
    // In a real implementation, this would be based on media.order more intelligently
    const paragraphs = result.split("\n\n");
    const insertPosition = Math.min(paragraphs.length - 1, (index + 1) * 3);
    paragraphs.splice(insertPosition, 0, placeholder);

    result = paragraphs.join("\n\n");
  });

  return result;
};

export default function BlogPostPage() {
  const reduceMotion = useReducedMotion();
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const [copyStatus, setCopyStatus] = useState("");
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("Link copied");
    } catch {
      setCopyStatus("Copy the address from your browser");
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await apiRequest(`/api/blog/${slug}`);
      return response as {
        success: boolean;
        post: BlogPost;
        media: BlogMedia[];
      };
    },
    enabled: !!slug,
  });

  const post = data?.post;
  const media = data?.media || NO_MEDIA;

  // Process content with media insertions
  const [processedContent, setProcessedContent] =
    useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!post) return;

    const rawContent = post.content.replace(
      /^#\s+(.+)\r?\n/,
      (heading, title: string) =>
        title.trim().toLowerCase() === post.title.trim().toLowerCase()
          ? ""
          : heading,
    );
    const contentWithMediaPlaceholders = insertMediaIntoContent(
      rawContent,
      media,
    );

    // Replace placeholders with actual media components
    const parts = contentWithMediaPlaceholders.split(/(\[MEDIA_\d+\])/);
    const processed = parts.map((part, index) => {
      const mediaMatch = part.match(/\[MEDIA_(\d+)\]/);
      if (mediaMatch) {
        const mediaIndex = parseInt(mediaMatch[1], 10);
        return media[mediaIndex] ? (
          <MediaElement key={`media-${index}`} media={media[mediaIndex]} />
        ) : null;
      }

      // Return the markdown component for text content
      return (
        <div key={`markdown-${index}`} className="min-w-0 max-w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="max-w-full overflow-x-auto whitespace-pre [overflow-wrap:normal] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  tabIndex={0}
                  aria-label="Code example"
                />
              ),
              table: ({ node, ...props }) => (
                <div
                  className="my-6 max-w-full overflow-x-auto"
                  tabIndex={0}
                  role="region"
                  aria-label="Scrollable table"
                >
                  <table {...props} className="min-w-full" />
                </div>
              ),
            }}
          >
            {part}
          </ReactMarkdown>
        </div>
      );
    });

    setProcessedContent(processed);
  }, [post, media]);

  return (
    <div className="portfolio-page article-page">
      <Header />
      <main id="main-content" className="pt-20">
        {isLoading ? (
          <div className="container px-4 mx-auto py-16">
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-80 w-full mb-8" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-8" />
              <Skeleton className="h-60 w-full mb-8" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-5/6 mb-4" />
            </div>
          </div>
        ) : error || !post ? (
          <div className="container px-4 mx-auto py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
              <p className="mb-6">
                Sorry, we couldn't find the blog post you're looking for.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/blog" className="folio-button">
                  Return to journal
                </Link>
                <Link href="/" className="folio-text-link">
                  Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="container px-4 sm:px-6 mx-auto py-6 sm:py-8">
            <div className="min-w-0 max-w-3xl mx-auto">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5 }}
              >
                <Link href="/blog" className="folio-text-link article-back">
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back to the journal
                </Link>
                <p className="folio-kicker article-eyebrow">
                  Field notes / Nick Gattuso III
                </p>
                <h1 className="text-3xl md:text-4xl leading-tight font-bold mb-6 [overflow-wrap:anywhere]">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
                  {post.status !== "published" && <span className="journal-draft">Private draft</span>}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} aria-hidden="true" />
                    <span>
                      {post.published_at
                        ? format(new Date(post.published_at), "MMMM d, yyyy")
                        : "Private draft"}
                    </span>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <Tag size={16} className="shrink-0" />
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="max-w-full"
                        >
                          <Badge
                            variant="outline"
                            className="max-w-full cursor-pointer [overflow-wrap:anywhere]"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {post.thumbnail_url && (
                  <div className="mb-8 overflow-hidden rounded-lg">
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="prose prose-base sm:prose-lg dark:prose-invert min-w-0 max-w-none [overflow-wrap:anywhere] prose-headings:scroll-mt-24 prose-pre:max-w-full prose-pre:text-sm sm:prose-pre:text-[0.875em]">
                  {processedContent}
                </div>

                <div className="article-end">
                  <Link className="folio-text-link" href="/blog">
                    <ArrowLeft size={16} aria-hidden="true" />
                    More from the journal
                  </Link>
                  <button
                    type="button"
                    className="folio-text-link"
                    onClick={copyLink}
                  >
                    Copy article link ↗
                  </button>
                  <span role="status">{copyStatus}</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
