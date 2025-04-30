import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost, BlogMedia } from "@shared/schema";

// Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { 
  ChevronLeft, 
  Calendar, 
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Share2
} from "lucide-react";

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
          <p className="text-sm text-center mt-2 text-gray-500 italic">{media.description}</p>
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
          <p className="text-sm text-center mt-2 text-gray-500 italic">{media.description}</p>
        )}
      </div>
    );
  }
  
  if (media.media_type === "video") {
    return (
      <div className="my-8">
        <div className="aspect-video">
          <video 
            src={media.url} 
            controls
            className="w-full h-full"
          />
        </div>
        {media.description && (
          <p className="text-sm text-center mt-2 text-gray-500 italic">{media.description}</p>
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
          <p className="text-sm text-center mt-2 text-gray-500 italic">{media.description}</p>
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
    const paragraphs = result.split('\n\n');
    const insertPosition = Math.min(paragraphs.length - 1, (index + 1) * 3);
    paragraphs.splice(insertPosition, 0, placeholder);
    
    result = paragraphs.join('\n\n');
  });
  
  return result;
};

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/blog', slug],
    queryFn: () => apiRequest<{ success: boolean; post: BlogPost; media: BlogMedia[] }>(`/api/blog/${slug}`),
    enabled: !!slug,
  });
  
  const post = data?.post;
  const media = data?.media || [];
  
  // Process content with media insertions
  const [processedContent, setProcessedContent] = useState<React.ReactNode | null>(null);
  
  useEffect(() => {
    if (!post) return;
    
    const rawContent = post.content;
    const contentWithMediaPlaceholders = insertMediaIntoContent(rawContent, media);
    
    // Replace placeholders with actual media components
    const parts = contentWithMediaPlaceholders.split(/(\[MEDIA_\d+\])/);
    const processed = parts.map((part, index) => {
      const mediaMatch = part.match(/\[MEDIA_(\d+)\]/);
      if (mediaMatch) {
        const mediaIndex = parseInt(mediaMatch[1], 10);
        return media[mediaIndex] ? <MediaElement key={`media-${index}`} media={media[mediaIndex]} /> : null;
      }
      
      // Process paragraphs and add proper styling
      return part.split('\n\n').map((paragraph, pIndex) => (
        <p key={`p-${index}-${pIndex}`} className="my-4">
          {paragraph}
        </p>
      ));
    });
    
    setProcessedContent(processed);
  }, [post, media]);

  if (isLoading) {
    return (
      <div className="container px-4 mx-auto py-16">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-6">
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
    );
  }

  if (error || !post) {
    return (
      <div className="container px-4 mx-auto py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the blog post you're looking for.</p>
          <Link href="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 pl-0 flex items-center gap-1">
              <ChevronLeft size={16} />
              Back to Blog
            </Button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{format(new Date(post.published_at), 'MMMM dd, yyyy')}</span>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={16} />
                {post.tags.map(tag => (
                  <Link key={tag} href={`/blog?tag=${tag}`}>
                    <Badge variant="outline" className="cursor-pointer">
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
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {processedContent}
          </div>
          
          <div className="mt-12 pt-6 border-t">
            <div className="flex flex-wrap justify-between items-center">
              <h3 className="text-lg font-semibold mb-4">Share this post</h3>
              <div className="flex gap-3">
                <Button size="icon" variant="outline">
                  <Facebook size={18} />
                </Button>
                <Button size="icon" variant="outline">
                  <Twitter size={18} />
                </Button>
                <Button size="icon" variant="outline">
                  <Linkedin size={18} />
                </Button>
                <Button size="icon" variant="outline">
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}