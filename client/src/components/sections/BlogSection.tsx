import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import JournalEntry from "@/components/ui/JournalEntry";
import { ArrowUpRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () =>
      (await apiRequest("/api/blog?limit=3")) as {
        success: boolean;
        posts: BlogPost[];
      },
  });
  return (
    <section
      id="blog"
      className="folio-section journal-section"
      aria-labelledby="journal-title"
    >
      <div className="folio-container">
        <div className="section-heading">
          <div>
            <p className="folio-kicker">IV / Field notes</p>
            <h2 id="journal-title">
              Thinking <em>out loud.</em>
            </h2>
          </div>
          <Link className="folio-text-link" href="/blog">
            All writing <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="journal-list">
          {isLoading ? (
            <p className="journal-status" role="status">
              Loading the latest writing…
            </p>
          ) : error ? (
            <p className="journal-status" role="alert">
              The writing couldn’t load.{" "}
              <Link href="/blog">Try the journal</Link>.
            </p>
          ) : data?.posts?.length ? (
            data.posts.map((post, index) => (
              <JournalEntry key={post.id} post={post} index={index} />
            ))
          ) : (
            <p className="journal-status">New notes are on the way.</p>
          )}
        </div>
      </div>
    </section>
  );
}
