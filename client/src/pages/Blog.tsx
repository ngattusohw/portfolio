import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JournalEntry from "@/components/ui/JournalEntry";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get("tag"),
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog", "all"],
    queryFn: async () =>
      (await apiRequest("/api/blog")) as {
        success: boolean;
        posts: BlogPost[];
      },
  });
  const tags = Array.from(
    new Set(data?.posts.flatMap((post) => post.tags || []) || []),
  );
  const posts = data?.posts.filter(
    (post) =>
      (!activeTag || post.tags?.includes(activeTag)) &&
      (!search ||
        [post.title, post.summary, ...(post.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  return (
    <div className="portfolio-page">
      <Header />
      <main id="main-content" className="journal-page">
        <div className="folio-container">
          <Link href="/" className="folio-text-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to the portfolio
          </Link>
          <div className="journal-page-heading">
            <p className="folio-kicker">The journal / Nick Gattuso III</p>
            <h1>
              Notes from
              <br />
              <em>the work.</em>
            </h1>
            <p>
              Things I’m building, problems I’m working through, and what I
              learn along the way.
            </p>
          </div>
          <div className="journal-search">
            <label htmlFor="article-search">
              <Search size={17} aria-hidden="true" />
              Search the journal
            </label>
            <input
              id="article-search"
              type="search"
              placeholder="A topic, a project, an idea…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {tags.length > 0 && (
            <div
              className="work-filters journal-filters"
              role="group"
              aria-label="Filter articles by topic"
            >
              {[null, ...tags].map((tag) => (
                <button
                  key={tag || "all"}
                  type="button"
                  aria-pressed={activeTag === tag}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag || "All writing"}
                </button>
              ))}
            </div>
          )}
          <div className="journal-list">
            {isLoading ? (
              <p role="status" className="journal-status">
                Loading the journal…
              </p>
            ) : error ? (
              <p role="alert" className="journal-status">
                The journal couldn’t load. Please try again.
              </p>
            ) : posts?.length ? (
              posts.map((post, index) => (
                <JournalEntry key={post.id} post={post} index={index} />
              ))
            ) : (
              <p className="journal-status" role="status">
                No notes match those filters. Try another topic or search.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
