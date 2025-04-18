import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { Edit, Trash2, Eye, MapPin, Briefcase, Calendar, Building } from "lucide-react";
import uploadToCloudinary from "@/lib/upload";
import debounce from "lodash/debounce";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const regions = {
    "Abu Dhabi Region": [
        "Abu Dhabi City", "Khalifa City", "Mohammed Bin Zayed City", "Shakhbout City",
        "Al Shahama", "Al Bahia", "Mussafah", "Al Wathba", "Bawabat Al Sharq",
        "Yas Island", "Saadiyat Island", "Reem Island"
    ],
    "Al Ain Region": [
        "Al Yahar", "Al Hili", "Al Muwaiji", "Al Jimi", "Zakhir", "Al Faqa",
        "Sweihan", "Al Hayer", "Shwaib"
    ],
    "Al Dhafra Region": [
        "Madinat Zayed", "Liwa", "Al Silaa’", "Ghayathi", "Delma Island", "Ruwais", "Al Mirfa"
    ],
};

const postTypes = ["EVENT", "JOB", "NEWS", "SERVICE"];

const validateForm = (data, type) => {
    const errors = [];

    if (!data.title?.trim()) errors.push("Title is required");
    if (!data.category?.trim()) errors.push("Category is required");
    if (!data.description?.trim() || data.description.length < 10) {
        errors.push("Description must be at least 10 characters");
    }
    if (!data.location1?.trim()) errors.push("Region is required");
    if (!data.location2?.trim()) errors.push("City is required");

    if (type === "EVENT") {
        if (!data.eventDate?.trim()) errors.push("Event date is required");
        if (!data.startTime?.trim()) errors.push("Start time is required");
        if (!data.endTime?.trim()) errors.push("End time is required");
    }

    if (type === "JOB") {
        if (!data.jobType?.trim()) errors.push("Job type is required");
        if (!data.company?.trim()) errors.push("Company is required");
        if (!data.salary?.trim()) errors.push("Salary is required");
        if (!data.contactEmail?.trim()) errors.push("Contact email is required");
        if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
            errors.push("Invalid email format");
        }
    }

    if (type === "SERVICE") {
        if (!data.contactEmail?.trim()) errors.push("Contact email is required");
        if (data.contactEmail && !/^[^\s@]+@[^\s@]+$/.test(data.contactEmail)) {
            errors.push("Invalid email format");
        }
    }

    return errors;
};

const PostsManagement = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [currentPostData, setCurrentPostData] = useState<any>({});

    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user, filterType]);

    const fetchPosts = async () => {
        try {
            let url = `${BACKEND_URL}/posts/my/${user.id}`;
            if (filterType && filterType !== "all") {
                url += `?type=${filterType}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Error fetching posts");
        }
    };

    const handleAddPost = () => {
        setCurrentPost(null);
        setCurrentPostData({
            title: "",
            category: "",
            description: "",
            location1: "",
            location2: "",
            image: "",
            eventDate: "",
            startTime: "",
            endTime: "",
            jobType: "Full-time",
            company: "",
            salary: "",
            contactEmail: user.email || "",
            contactPhone: "",
        });
        setIsEditing(false);
        setSelectedType(null);
        setIsFormOpen(true);
    };

    const handleEditPost = (post) => {
        setCurrentPost(post);
        setCurrentPostData(post);
        setIsEditing(true);
        setSelectedType(post.type);
        setIsFormOpen(true);
    };

    const handleViewPost = (post) => {
        setCurrentPost(post);
        setIsDetailOpen(true);
    };

    const handleDeletePost = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/posts/${postId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete post");
            toast.success("Post deleted successfully");
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Error deleting post");
        }
    };

    const handleSavePost = async (data) => {
        const errors = validateForm(data, selectedType);
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        try {
            const payload = {
                ...data,
                type: selectedType,
                createdBy: user.id,
            };
            if (isEditing && currentPost) {
                const res = await fetch(`${BACKEND_URL}/posts/${currentPost.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to update post");
                const updated = await res.json();
                toast.success("Post updated successfully");
                setPosts(prev => prev.map(p => (p.id === currentPost.id ? updated.post : p)));
            } else {
                const res = await fetch(`${BACKEND_URL}/posts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to create post");
                const newPost = await res.json();
                toast.success("Post created successfully");
                setPosts(prev => [...prev, newPost.post]);
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("Error saving post");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUploading(true);
            try {
                const result = await uploadToCloudinary(file);
                if (result.URL) {
                    setCurrentPostData({ image: result.URL });
                    toast.success("Image uploaded successfully");
                } else {
                    toast.error("Failed to upload image");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image");
            } finally {
                setImageUploading(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-24 px-4">
                    <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                        <p className="text-muted-foreground mb-6">You need to be logged in to view this page.</p>
                        <Button asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const PostCard = ({ post, onEdit, onDelete, onView }) => {
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
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{post.description}</p>
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
                                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                <CardDescription>
                                    <div className="flex items-center">
                                        <Building className="h-4 w-4 mr-1 text-primary" />
                                        {post.company}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{post.description}</p>
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
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{post.description}</p>
                                {post.image && <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />}
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
                                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{post.description}</p>
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
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="outline" size="icon" onClick={onEdit}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={onDelete}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={onView}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        );
    };

    const PostFormDialog = React.memo(({ isOpen, onClose, onSubmit, post, isEditing }) => {
        const [cities, setCities] = useState([]);

        useEffect(() => {
            if (currentPostData.location1) {
                setCities(regions[currentPostData.location1] || []);
                if (!cities.includes(currentPostData.location2)) {
                    setCurrentPostData(prev => ({ ...prev, location2: "" }));
                }
            } else {
                setCities([]);
            }
        }, [currentPostData.location1]);

        const debouncedSetPostData = useCallback(
            debounce((key, value) => {
                setCurrentPostData(prev => ({ ...prev, [key]: value }));
            }, 100),
            []
        );

        const handleInputChange = (key, value) => {
            debouncedSetPostData(key, value);
        };

        const handleTypeSelect = (type) => {
            setSelectedType(type);
            setCurrentPostData({
                title: "",
                category: "",
                description: "",
                location1: "",
                location2: "",
                image: "",
                eventDate: "",
                startTime: "",
                endTime: "",
                jobType: "Full-time",
                company: "",
                salary: "",
                contactEmail: user.email || "",
                contactPhone: "",
            });
        };

        const handleFormSubmit = (e) => {
            e.preventDefault();
            debouncedSetPostData.flush();
            onSubmit(currentPostData);
        };

        const renderFormFields = () => {
            switch (selectedType) {
                case "EVENT":
                    return (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title*</label>
                                <Input
                                    placeholder="Enter event title"
                                    value={currentPostData.title || ""}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category*</label>
                                <Input
                                    placeholder="Enter category"
                                    value={currentPostData.category || ""}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description*</label>
                                <Textarea
                                    placeholder="Describe the event"
                                    value={currentPostData.description || ""}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Region*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location1", value)}
                                    value={currentPostData.location1 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(regions).map(region => (
                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location2", value)}
                                    value={currentPostData.location2 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={imageUploading}
                                />
                                {imageUploading && <p>Uploading image...</p>}
                                {currentPostData.image && !imageUploading && (
                                    <img src={currentPostData.image} alt="Event" className="mt-2 h-40 object-cover" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Date*</label>
                                <Input
                                    type="date"
                                    value={currentPostData.eventDate || ""}
                                    onChange={(e) => handleInputChange("eventDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Time*</label>
                                <Input
                                    type="time"
                                    value={currentPostData.startTime || ""}
                                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Time*</label>
                                <Input
                                    type="time"
                                    value={currentPostData.endTime || ""}
                                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                                />
                            </div>
                        </>
                    );
                case "JOB":
                    return (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Job Title*</label>
                                <Input
                                    placeholder="Enter job title"
                                    value={currentPostData.title || ""}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company*</label>
                                <Input
                                    placeholder="Enter company name"
                                    value={currentPostData.company || ""}
                                    onChange={(e) => handleInputChange("company", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category*</label>
                                <Input
                                    placeholder="Enter category"
                                    value={currentPostData.category || ""}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description*</label>
                                <Textarea
                                    placeholder="Describe the job"
                                    value={currentPostData.description || ""}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Region*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location1", value)}
                                    value={currentPostData.location1 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(regions).map(region => (
                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location2", value)}
                                    value={currentPostData.location2 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={imageUploading}
                                />
                                {imageUploading && <p>Uploading image...</p>}
                                {currentPostData.image && !imageUploading && (
                                    <img src={currentPostData.image} alt="Job" className="mt-2 h-40 object-cover" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Job Type*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("jobType", value)}
                                    value={currentPostData.jobType || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Salary*</label>
                                <Input
                                    placeholder="Enter salary"
                                    value={currentPostData.salary || ""}
                                    onChange={(e) => handleInputChange("salary", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Email*</label>
                                <Input
                                    type="email"
                                    placeholder="Enter contact email"
                                    value={currentPostData.contactEmail || ""}
                                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <Input
                                    placeholder="Enter contact phone"
                                    value={currentPostData.contactPhone || ""}
                                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                                />
                            </div>
                        </>
                    );
                case "NEWS":
                    return (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title*</label>
                                <Input
                                    placeholder="Enter news title"
                                    value={currentPostData.title || ""}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category*</label>
                                <Input
                                    placeholder="Enter category"
                                    value={currentPostData.category || ""}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description*</label>
                                <Textarea
                                    placeholder="Describe the news"
                                    value={currentPostData.description || ""}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Region*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location1", value)}
                                    value={currentPostData.location1 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(regions).map(region => (
                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location2", value)}
                                    value={currentPostData.location2 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={imageUploading}
                                />
                                {imageUploading && <p>Uploading image...</p>}
                                {currentPostData.image && !imageUploading && (
                                    <img src={currentPostData.image} alt="News" className="mt-2 h-40 object-cover" />
                                )}
                            </div>
                        </>
                    );
                case "SERVICE":
                    return (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title*</label>
                                <Input
                                    placeholder="Enter service title"
                                    value={currentPostData.title || ""}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category*</label>
                                <Input
                                    placeholder="Enter category"
                                    value={currentPostData.category || ""}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description*</label>
                                <Textarea
                                    placeholder="Describe the service"
                                    value={currentPostData.description || ""}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Region*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location1", value)}
                                    value={currentPostData.location1 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(regions).map(region => (
                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City*</label>
                                <Select
                                    onValueChange={(value) => handleInputChange("location2", value)}
                                    value={currentPostData.location2 || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={imageUploading}
                                />
                                {imageUploading && <p>Uploading image...</p>}
                                {currentPostData.image && !imageUploading && (
                                    <img src={currentPostData.image} alt="Service" className="mt-2 h-40 object-cover" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Email*</label>
                                <Input
                                    type="email"
                                    placeholder="Enter contact email"
                                    value={currentPostData.contactEmail || ""}
                                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <Input
                                    placeholder="Enter contact phone"
                                    value={currentPostData.contactPhone || ""}
                                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                                />
                            </div>
                        </>
                    );
                default:
                    return null;
            }
        };

        return (
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    setSelectedType(null);
                    setCurrentPostData({});
                }
                onClose();
            }}>
                <DialogContent className="sm:max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? `Edit ${selectedType} Post` : "Add New Post"}</DialogTitle>
                    </DialogHeader>
                    {!selectedType && !isEditing ? (
                        <div className="flex flex-col gap-4">
                            <p>Select the type of post you want to create:</p>
                            <div className="flex gap-2">
                                {postTypes.map(type => (
                                    <Button key={type} onClick={() => handleTypeSelect(type)}>
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {renderFormFields()}
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={onClose} disabled={imageUploading}>
                                    Cancel
                                </Button>
                                <Button onClick={handleFormSubmit} disabled={imageUploading}>
                                    {isEditing ? "Update Post" : "Create Post"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        );
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 px-4 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Posts Management</h1>
                        <p className="text-muted-foreground">Manage all your posts</p>
                    </div>
                    <Button onClick={handleAddPost} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Post
                    </Button>
                </div>

                <div className="mb-6">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Posts</SelectItem>
                            {postTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onEdit={() => handleEditPost(post)}
                            onDelete={() => handleDeletePost(post.id)}
                            onView={() => handleViewPost(post)}
                        />
                    ))}
                </div>

                <PostFormDialog
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSavePost}
                    post={currentPost}
                    isEditing={isEditing}
                />

                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentPost?.title}</DialogTitle>
                        </DialogHeader>
                        <div>
                            <p>Type: {currentPost?.type}</p>
                            <p>Category: {currentPost?.category}</p>
                            <p>Description: {currentPost?.description}</p>
                            <p>Location: {currentPost?.location1}, {currentPost?.location2}</p>
                            {currentPost?.image && <img src={currentPost.image} alt={currentPost.title} className="w-full h-40 object-cover" />}
                            {currentPost?.type === "EVENT" && (
                                <>
                                    <p>Date: {currentPost.eventDate}</p>
                                    <p>Time: {currentPost.startTime} - {currentPost.endTime}</p>
                                </>
                            )}
                            {currentPost?.type === "JOB" && (
                                <>
                                    <p>Company: {currentPost.company}</p>
                                    <p>Job Type: {currentPost.jobType}</p>
                                    <p>Salary: {currentPost.salary}</p>
                                    <p>Contact: {currentPost.contactEmail} {currentPost.contactPhone}</p>
                                </>
                            )}
                            {currentPost?.type === "SERVICE" && (
                                <p>Contact: {currentPost.contactEmail} {currentPost.contactPhone}</p>
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