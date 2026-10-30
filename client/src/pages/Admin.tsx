import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError, apiRequest, queryClient } from "@/lib/queryClient";
import { type BlogPost, blogPostSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AuthButtons from "@/components/ui/AuthButtons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Check, Eye, Loader2, PenSquare, Plus, Trash2 } from "lucide-react";

// Keep text inputs as strings; normalize them when building the API payload.
const blogFormSchema = blogPostSchema.extend({
  thumbnail_url: z.string().trim().refine(
    value => value === "" || z.string().url().safeParse(value).success,
    "Enter a valid image URL, or leave this blank.",
  ),
  tags: z.string(),
  status: z.enum(["draft", "published"]),
});
type BlogFormValues = z.infer<typeof blogFormSchema>;
type PostsResponse = { success: boolean; posts: BlogPost[] };

const emptyPost: BlogFormValues = {
  title: "", slug: "", summary: "", content: "", thumbnail_url: "", tags: "", status: "draft",
};
const slugFromTitle = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAuthenticated, isAuthorized, isLoading: authLoading } = useAuth();
  const canManage = isAuthenticated && isAuthorized;
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: emptyPost,
  });
  const { isDirty, isSubmitting } = form.formState;
  const selectedStatus = form.watch("status");
  const previewContent = form.watch("content");

  const { data: postsData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/blog", "admin"],
    queryFn: () => apiRequest<PostsResponse>("/api/blog?limit=100"),
    enabled: canManage,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isDirty) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [isDirty]);

  const canDiscardChanges = () => !isDirty || window.confirm("Discard your unsaved changes?");
  const startNewPost = () => {
    if (!canDiscardChanges()) return;
    setEditingPostId(null);
    form.reset(emptyPost);
    setPreview(false);
    setActiveTab("editor");
  };
  const editPost = (post: BlogPost) => {
    if (!canDiscardChanges()) return;
    setEditingPostId(post.id);
    form.reset({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      thumbnail_url: post.thumbnail_url || "",
      tags: (post.tags || []).join(", "),
      status: post.status === "published" ? "published" : "draft",
    });
    setPreview(false);
    setActiveTab("editor");
  };
  const cancelEditing = () => {
    if (!canDiscardChanges()) return;
    form.reset(emptyPost);
    setEditingPostId(null);
    setActiveTab("posts");
    setPreview(false);
  };
  const refreshPosts = () => queryClient.invalidateQueries({ queryKey: ["/api/blog"] });

  const onSubmit = async (values: BlogFormValues) => {
    form.clearErrors("root");
    const data = {
      ...values,
      thumbnail_url: values.thumbnail_url || null,
      tags: Array.from(new Set(values.tags.split(",").map(tag => tag.trim()).filter(Boolean))),
    };
    try {
      await apiRequest(editingPostId ? `/api/blog/${editingPostId}` : "/api/blog", {
        method: editingPostId ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      toast({
        title: values.status === "published" ? "Post published" : "Draft saved",
        description: values.status === "published" ? "Your post is visible on the blog." : "Only you can see this post until you publish it.",
      });
      form.reset(emptyPost);
      setEditingPostId(null);
      setActiveTab("posts");
      setPreview(false);
      await refreshPosts();
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      }
      form.setError("root.server", {
        message: error instanceof Error ? error.message : "Your post could not be saved. Please try again.",
      });
    }
  };

  const deletePost = async () => {
    if (!postToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/api/blog/${postToDelete.id}`, { method: "DELETE" });
      if (editingPostId === postToDelete.id) {
        form.reset(emptyPost);
        setEditingPostId(null);
      }
      setPostToDelete(null);
      toast({ title: "Post deleted" });
      await refreshPosts();
    } catch (error) {
      toast({ title: "Post could not be deleted", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return <div className="container mx-auto max-w-5xl px-4 pb-16 pt-28" role="status"><Loader2 className="mr-2 inline h-5 w-5 animate-spin" />Checking sign-in…</div>;
  }
  if (!isAuthenticated) return <AdminLogin />;
  if (!isAuthorized) {
    return <div className="container mx-auto max-w-lg px-4 pb-16 pt-28"><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Owner access required</AlertTitle><AlertDescription>Sign in with the portfolio owner's account to manage posts.</AlertDescription></Alert><div className="mt-6"><AuthButtons /></div></div>;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6">
      <div className="mb-8 flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-3xl font-bold">Blog management</h1><p className="mt-1 text-muted-foreground">Write drafts, preview Markdown, and publish when you're ready.</p></div>
          <AuthButtons />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="min-h-11"><Link href="/blog">View blog</Link></Button>
          <Button onClick={startNewPost} disabled={isSubmitting} className="min-h-11"><Plus className="mr-2 h-4 w-4" />New post</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0 space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:w-72">
          <TabsTrigger value="posts" className="min-h-11">All posts</TabsTrigger>
          <TabsTrigger value="editor" className="min-h-11">{editingPostId ? "Edit post" : "New post"}{isDirty ? " •" : ""}</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-4">
          {isLoading ? <div className="space-y-4" role="status" aria-label="Loading posts"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div> : error ? (
            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Posts could not be loaded</AlertTitle><AlertDescription><p>Please try again. Your saved posts have not changed.</p><Button variant="outline" className="mt-3 min-h-11" onClick={() => refetch()}>Try again</Button></AlertDescription></Alert>
          ) : !postsData?.posts.length ? (
            <Card><CardContent className="pt-6 text-center"><p className="text-muted-foreground">No posts yet. Start with a private draft.</p><Button onClick={startNewPost} className="mt-4 min-h-11"><Plus className="mr-2 h-4 w-4" />Write a post</Button></CardContent></Card>
          ) : (
            <ul className="space-y-4" aria-label="Blog posts">{postsData.posts.map(post => (
              <li key={post.id}><Card><CardContent className="flex min-w-0 flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="break-words text-lg font-semibold">{post.title}</h2><Badge variant={post.status === "published" ? "default" : "outline"}>{post.status}</Badge></div>
                  <p className="break-all text-sm text-muted-foreground">/blog/{post.slug}</p>
                  <p className="text-xs text-muted-foreground">{post.updated_at ? `Updated ${format(new Date(post.updated_at), "MMM d, yyyy")}` : "No update date"}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button variant="outline" className="min-h-11" onClick={() => editPost(post)}><PenSquare className="mr-2 h-4 w-4" />Edit<span className="sr-only"> {post.title}</span></Button>
                  <Button asChild variant="outline" className="min-h-11"><Link href={`/blog/${post.slug}`}><Eye className="mr-2 h-4 w-4" />{post.status === "published" ? "View" : "Preview"}<span className="sr-only"> {post.title}</span></Link></Button>
                  <Button variant="ghost" className="h-11 w-11 text-destructive hover:text-destructive" onClick={() => setPostToDelete(post)} aria-label={`Delete ${post.title}`}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent></Card></li>
            ))}</ul>
          )}
          {postsData && postsData.posts.length >= 100 && <p className="text-sm text-muted-foreground">Showing the latest 100 posts.</p>}
        </TabsContent>

        <TabsContent value="editor">
          <Card className="min-w-0">
            <CardHeader className="p-4 sm:p-6"><CardTitle>{editingPostId ? "Edit post" : "Create a post"}</CardTitle><CardDescription>New posts start as drafts. Published posts are visible to everyone.</CardDescription></CardHeader>
            <CardContent className="min-w-0 p-4 pt-0 sm:p-6 sm:pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, () => setPreview(false))} className="min-w-0 space-y-6">
                  <fieldset disabled={isSubmitting} className="min-w-0 space-y-6 disabled:opacity-70">
                    <legend className="sr-only">Blog post details</legend>
                    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField control={form.control} name="title" render={({ field }) => <FormItem className="min-w-0"><FormLabel>Title</FormLabel><FormControl><Input placeholder="What I've been working on" {...field} onChange={event => {
                        const oldTitle = field.value;
                        const currentSlug = form.getValues("slug");
                        field.onChange(event);
                        if (!editingPostId && (!currentSlug || currentSlug === slugFromTitle(oldTitle))) {
                          form.setValue("slug", slugFromTitle(event.target.value), { shouldDirty: true });
                        }
                      }} /></FormControl><FormMessage /></FormItem>} />
                      <FormField control={form.control} name="slug" render={({ field }) => <FormItem className="min-w-0"><FormLabel>Slug</FormLabel><FormControl><Input placeholder="what-ive-been-working-on" autoCapitalize="none" autoCorrect="off" spellCheck={false} {...field} /></FormControl><FormDescription>The part after /blog/ in the post's URL.</FormDescription><FormMessage /></FormItem>} />
                    </div>
                    <FormField control={form.control} name="summary" render={({ field }) => <FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea placeholder="A short introduction for the blog listing…" className="min-h-24 resize-y" {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="content" render={({ field }) => <FormItem className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-3"><FormLabel>Content</FormLabel><Button type="button" variant="outline" size="sm" className="min-h-11" aria-pressed={preview} onClick={() => setPreview(value => !value)}><Eye className="mr-2 h-4 w-4" />{preview ? "Continue writing" : "Preview Markdown"}</Button></div>
                      {preview ? <div className="min-h-[300px] min-w-0 rounded-md border p-4" aria-label="Markdown preview"><div className="prose prose-sm min-w-0 max-w-none break-words dark:prose-invert [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"><ReactMarkdown remarkPlugins={[remarkGfm]}>{previewContent || "Your Markdown preview will appear here."}</ReactMarkdown></div></div> : <FormControl><Textarea placeholder="Write your post in Markdown…" className="min-h-[320px] resize-y font-mono" {...field} /></FormControl>}
                      <FormDescription>Markdown supports headings, links, lists, code blocks, and images: ![Description](https://example.com/image.jpg).</FormDescription><FormMessage />
                    </FormItem>} />
                    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField control={form.control} name="thumbnail_url" render={({ field }) => <FormItem className="min-w-0"><FormLabel>Thumbnail URL <span className="font-normal text-muted-foreground">(optional)</span></FormLabel><FormControl><Input type="url" placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormDescription>Leave blank to use no thumbnail.</FormDescription><FormMessage /></FormItem>} />
                      <FormField control={form.control} name="tags" render={({ field }) => <FormItem className="min-w-0"><FormLabel>Tags <span className="font-normal text-muted-foreground">(optional)</span></FormLabel><FormControl><Input placeholder="tech, programming, startup" {...field} /></FormControl><FormDescription>Separate tags with commas.</FormDescription><FormMessage /></FormItem>} />
                    </div>
                    <FormField control={form.control} name="status" render={({ field }) => <FormItem>
                      <fieldset><legend className="mb-2 text-sm font-medium">Visibility</legend><div className="flex flex-wrap gap-x-6 gap-y-2">
                        <label className="flex min-h-11 cursor-pointer items-center gap-2"><input type="radio" name={field.name} value="draft" checked={field.value === "draft"} onChange={() => field.onChange("draft")} onBlur={field.onBlur} ref={field.ref} className="h-4 w-4" />Draft — only you</label>
                        <label className="flex min-h-11 cursor-pointer items-center gap-2"><input type="radio" name={field.name} value="published" checked={field.value === "published"} onChange={() => field.onChange("published")} onBlur={field.onBlur} className="h-4 w-4" />Published — everyone</label>
                      </div></fieldset><FormMessage />
                    </FormItem>} />
                  </fieldset>
                  {form.formState.errors.root?.server && <Alert variant="destructive" role="alert"><AlertCircle className="h-4 w-4" /><AlertTitle>Post could not be saved</AlertTitle><AlertDescription>{form.formState.errors.root.server.message}</AlertDescription></Alert>}
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" className="min-h-11" disabled={isSubmitting} onClick={cancelEditing}>Cancel</Button>
                    <Button type="submit" className="min-h-11" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}{isSubmitting ? "Saving…" : selectedStatus === "published" ? (editingPostId ? "Update published post" : "Publish post") : "Save draft"}</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!postToDelete} onOpenChange={open => { if (!open && !isDeleting) setPostToDelete(null); }}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
          <AlertDialogHeader><AlertDialogTitle>Delete this post?</AlertDialogTitle><AlertDialogDescription>“{postToDelete?.title}” will be permanently removed, including its associated media. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={isDeleting} className="min-h-11">Keep post</AlertDialogCancel><AlertDialogAction disabled={isDeleting} className="min-h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={event => { event.preventDefault(); void deletePost(); }}>{isDeleting ? "Deleting…" : "Delete post"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
