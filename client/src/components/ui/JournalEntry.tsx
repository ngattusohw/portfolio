import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";
export default function JournalEntry({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  return (
    <article className="journal-entry">
      <div className="journal-date">
        <span className="folio-kicker">
          {String(index + 1).padStart(2, "0")} / Note
        </span>
        {post.published_at && (
          <time dateTime={new Date(post.published_at).toISOString()}>
            {format(new Date(post.published_at), "MMM d, yyyy")}
          </time>
        )}
        {post.status !== "published" && (
          <span className="journal-draft">Private draft</span>
        )}
      </div>
      <div className="journal-copy">
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.summary}</p>
        <div className="journal-tags">
          {post.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <Link
        className="journal-arrow"
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
      >
        <ArrowUpRight size={26} aria-hidden="true" />
      </Link>
    </article>
  );
}
