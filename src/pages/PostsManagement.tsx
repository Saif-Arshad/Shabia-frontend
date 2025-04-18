import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, MapPin, Briefcase, Calendar, Building } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const postTypes = ["EVENT", "JOB", "NEWS", "SERVICE"];

const PostsManagement = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        if (user) fetchPosts();
    }, [user, filterType]);

    const fetchPosts = async () => {
        try {
            let url = `${BACKEND_URL}/posts/my/${user.id}`;
            if (filterType !== "all") url += `?type=${filterType}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error(err);
            toast.error("Error fetching posts");
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/posts/${postId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            toast.success("Deleted");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting post");
        }
    };

    const handleView = (post) => {
        setCurrentPost(post);
        setIsDetailOpen(true);
    };

    const PostCard = ({ post }) => {
        const renderContent = () => {
            switch (post.type) {
                case "EVENT":
                    return (
                        <>
                            <CardHeader>
                                <Badge className="absolute top-2 right-2">Event</Badge>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <CardDescription>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-primary" />
                                        {post.eventDate}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                                    {post.description}
                                </p>
                                <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    {post.location1}, {post.location2}
                                </div>
                            </CardContent>
                        </>
                    );
                case "JOB":
                    return (
                        <>
                            <CardHeader>
                                <Badge className="absolute top-2 right-2">{post.jobType}</Badge>
                                <CardTitle className="line-clamp-2 ">{post.title}</CardTitle>
                                <CardDescription>
                                    <div className="flex items-center">
                                        <Building className="h-4 w-4 mr-1 text-primary" />
                                        {post.company}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                                    {post.description}
                                </p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                                        {post.location1}, {post.location2}
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="h-4 w-4 mr-2 text-primary" />
                                        {post.salary}
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    );
                case "NEWS":
                    return (
                        <>
                            <CardHeader>
                                <Badge className="absolute top-2 right-2">News</Badge>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <CardDescription>{post.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                                    {post.description}
                                </p>
                            
                            </CardContent>
                        </>
                    );
                case "SERVICE":
                    return (
                        <>
                            <CardHeader>
                                <Badge className="absolute top-2 right-2">Service</Badge>
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <CardDescription>{post.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                                    {post.description}
                                </p>
                                <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    {post.location1}, {post.location2}
                                </div>
                            </CardContent>
                        </>
                    );
                default:
                    return null;
            }
        };

        return (
            <Card className="group overflow-hidden relative h-full flex flex-col">
                {renderContent()}
                <CardFooter className="mt-auto">
                    <div className="flex gap-2  transition-opacity duration-300">
                        <Link to={`/dashboard/add-post?id=${post.id}`}>
                            <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleView(post)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        );
    };

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-24 px-4">
                    <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                        <p className="text-muted-foreground mb-6">
                            You need to be logged in to view this page.
                        </p>
                        <Button asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 px-4 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Posts Management</h1>
                        <p className="text-muted-foreground">Manage all your posts</p>
                    </div>
                    <Link to="/dashboard/add-post">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Post
                        </Button>
                    </Link>
                </div>

                <div className="mb-6">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Posts</SelectItem>
                            {postTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentPost?.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            <p>Type: {currentPost?.type}</p>
                            <p>Category: {currentPost?.category}</p>
                            <p>Description: {currentPost?.description}</p>
                            <p>
                                Location: {currentPost?.location1}, {currentPost?.location2}
                            </p>
                            {currentPost?.image && (
                                <img
                                    src={currentPost.image}
                                    alt={currentPost.title}
                                    className="w-full h-40 object-cover"
                                />
                            )}
                            {currentPost?.type === "EVENT" && (
                                <>
                                    <p>Date: {currentPost.eventDate}</p>
                                    <p>
                                        Time: {currentPost.startTime} - {currentPost.endTime}
                                    </p>
                                </>
                            )}
                            {currentPost?.type === "JOB" && (
                                <>
                                    <p>Company: {currentPost.company}</p>
                                    <p>Job Type: {currentPost.jobType}</p>
                                    <p>Salary: {currentPost.salary}</p>
                                    <p>
                                        Contact: {currentPost.contactEmail} {currentPost.contactPhone}
                                    </p>
                                </>
                            )}
                            {currentPost?.type === "SERVICE" && (
                                <p>
                                    Contact: {currentPost.contactEmail} {currentPost.contactPhone}
                                </p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};

export default PostsManagement;
