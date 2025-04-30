import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";

// Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['/api/blog', activeTag],
    queryFn: async () => {
      const response = await apiRequest(
        activeTag ? `/api/blog?tag=${activeTag}` : '/api/blog'
      );
      return response as { success: boolean; posts: BlogPost[] };
    },
  });
  
  // For demo purposes, extract all unique tags from posts
  const allTags = data?.posts?.reduce((tags: string[], post) => {
    post.tags?.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, []) || [];

  // Filter posts by search term
  const filteredPosts = data?.posts?.filter(post => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container px-4 mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">The Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center mb-8">
          Thoughts, tutorials, and insights from my journey in tech and entrepreneurship
        </p>
        
        <div className="max-w-md mx-auto mb-8">
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge
              variant={activeTag === null ? "default" : "outline"}
              className="cursor-pointer py-1 px-3"
              onClick={() => setActiveTag(null)}
            >
              All
            </Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer py-1 px-3"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
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
      ) : (
        <>
          {filteredPosts?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No blog posts found. Try a different search term or tag.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                        {post.tags?.map(tag => (
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
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}