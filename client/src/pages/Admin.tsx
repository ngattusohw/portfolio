import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BlogPost, blogPostSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";

// Components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

// Icons
import { 
  PenSquare, 
  Trash2,
  Eye, 
  Plus,
  AlertCircle,
  Check
} from "lucide-react";

// Extend the blog post schema with form validations
const blogFormSchema = blogPostSchema.extend({
  tags: z.string().optional().transform(val => 
    val ? val.split(',').map(tag => tag.trim()) : []
  ),
});

// Form type
type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("posts");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all blog posts
  const { data: postsData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/blog', 'admin'],
    queryFn: async () => {
      const response = await apiRequest('/api/blog');
      return response as { success: boolean; posts: BlogPost[] };
    }
  });

  // Get the post being edited if any
  const editingPost = editingPostId ? postsData?.posts.find(post => post.id === editingPostId) : null;

  // Setup form
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: editingPost?.title || "",
      slug: editingPost?.slug || "",
      summary: editingPost?.summary || "",
      content: editingPost?.content || "",
      thumbnail_url: editingPost?.thumbnail_url || "",
      tags: editingPost?.tags ? editingPost.tags.join(', ') : "",
      status: editingPost?.status || "draft"
    }
  });

  // Update form values when editing post changes
  useEffect(() => {
    if (editingPost) {
      form.reset({
        title: editingPost.title,
        slug: editingPost.slug,
        summary: editingPost.summary,
        content: editingPost.content,
        thumbnail_url: editingPost.thumbnail_url || "",
        tags: editingPost.tags ? editingPost.tags.join(', ') : "",
        status: editingPost.status
      });
    } else {
      form.reset({
        title: "",
        slug: "",
        summary: "",
        content: "",
        thumbnail_url: "",
        tags: "",
        status: "draft"
      });
    }
  }, [editingPost, form]);

  // Form submission handler
  const onSubmit = async (data: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingPostId) {
        // Update existing post
        await apiRequest(`/api/blog/${editingPostId}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        toast({
          title: "Post updated",
          description: "Your blog post has been updated successfully."
        });
      } else {
        // Create new post
        await apiRequest('/api/blog', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        toast({
          title: "Post created",
          description: "Your blog post has been created successfully."
        });
      }
      
      // Reset form and refetch posts
      form.reset();
      setEditingPostId(null);
      setActiveTab("posts");
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      await refetch();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "There was an error saving your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete post handler
  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      await apiRequest(`/api/blog/${id}`, {
        method: 'DELETE'
      });
      toast({
        title: "Post deleted",
        description: "Your blog post has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      await refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "There was an error deleting your post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form.getValues().slug || editingPostId === null) {
      const title = e.target.value;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <div className="container px-4 mx-auto py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your blog posts</p>
        </div>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">Back to Website</Button>
          </Link>
          {activeTab === "posts" ? (
            <Button onClick={() => setActiveTab("editor")}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          ) : (
            <Button onClick={() => {
              setEditingPostId(null);
              form.reset();
              setActiveTab("posts");
            }} variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="editor">{editingPostId ? "Edit Post" : "New Post"}</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load blog posts. Please refresh the page and try again.
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              {!postsData?.posts?.length ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">No blog posts yet. Create your first post to get started!</p>
                    <Button onClick={() => setActiveTab("editor")} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {postsData.posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-gray-500">{post.slug}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={post.status === "published" ? "default" : "outline"}>
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {format(new Date(post.published_at || new Date()), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setEditingPostId(post.id);
                                  setActiveTab("editor");
                                }}
                              >
                                <PenSquare className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{editingPostId ? "Edit Post" : "Create New Post"}</CardTitle>
              <CardDescription>
                Fill in the details below to {editingPostId ? "update your" : "create a new"} blog post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="My Awesome Blog Post" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handleTitleChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="my-awesome-blog-post" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version of the title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief summary of your blog post..." 
                            className="resize-none h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your blog post content here..." 
                            className="resize-none min-h-[300px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Use blank lines to separate paragraphs. You can add media after saving.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="thumbnail_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to the thumbnail image for this post
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input placeholder="tech, programming, startup" {...field} />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of tags
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="draft"
                              value="draft"
                              checked={field.value === "draft"}
                              onChange={() => field.onChange("draft")}
                              className="form-radio h-4 w-4"
                            />
                            <label htmlFor="draft">Draft</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="published"
                              value="published"
                              checked={field.value === "published"}
                              onChange={() => field.onChange("published")}
                              className="form-radio h-4 w-4"
                            />
                            <label htmlFor="published">Published</label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingPostId(null);
                        form.reset();
                        setActiveTab("posts");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Check className="mr-2 h-4 w-4" />
                          {editingPostId ? "Update" : "Save"} Post
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}