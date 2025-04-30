import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { BlogPost } from "@shared/schema";

interface BlogPostCardProps {
  post: BlogPost;
  delay: number;
}

const BlogPostCard = ({ post, delay }: BlogPostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription>
            {format(new Date(post.published_at || new Date()), 'MMMM dd, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm line-clamp-4 mb-4">{post.summary}</p>
          {post.thumbnail_url && (
            <div className="relative aspect-video mb-4 overflow-hidden rounded-md">
              <img 
                src={post.thumbnail_url} 
                alt={post.title} 
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/blog/${post.slug}`}>
            <Button variant="outline" className="w-full">Read More</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const response = await apiRequest('/api/blog?limit=3');
      return response as { success: boolean; posts: BlogPost[] };
    },
  });

  return (
    <section ref={sectionRef} id="blog" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <motion.div 
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from My Blog</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights from my journey in tech and entrepreneurship
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <Skeleton className="h-32 w-full rounded-md mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load blog posts</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.posts?.length ? (
                data.posts.map((post: BlogPost, index: number) => (
                  <BlogPostCard 
                    key={post.id} 
                    post={post} 
                    delay={index} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No blog posts yet. Check back soon!</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button size="lg">
                  View All Posts
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}