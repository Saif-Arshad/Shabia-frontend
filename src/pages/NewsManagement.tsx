/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NewsCard from "@/components/news/NewsCard";
import NewsDetailDialog from "@/components/news/NewsDetailDialog";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import uploadToCloudinary from "@/lib/upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NewsManagement = () => {
  const { user } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  const [currentNews, setCurrentNews] = useState<any>({
    id: 0,
    title: "",
    category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/news/get-news/${user.id}`
      );
      setNewsList(response.data.news || []);
    } catch (err) {
      toast.error("Error fetching news");
      console.error(err);
    }
    setLoading(false);
  };

  // Handles file input changes: uploads image to Cloudinary and updates state.
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true);
      const result = await uploadToCloudinary(file);
      if (result.URL) {
        setCurrentNews((prev) => ({ ...prev, image: result.URL }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
      setImageUploading(false);
    }
  };

  // Add new news article with the uploaded image.
  const handleAddNews = async (e) => {
    e.preventDefault();

    if (
      !currentNews.title ||
      !currentNews.category ||
      !currentNews.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: currentNews.title,
        category: currentNews.category,
        description: currentNews.description,
        image: currentNews.image,
        createdBy: user.id,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/news`,
        payload
      );
      const newNews = response.data.news;
      // Prepend the new news to the list
      setNewsList([newNews, ...newsList]);
      toast.success("News created successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Error creating news");
      console.error(err);
    }
    setSubmitting(false);
  };

  // Update an existing news article.
  const handleEditNews = async (e) => {
    e.preventDefault();

    if (
      !currentNews.title ||
      !currentNews.category ||
      !currentNews.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: currentNews.title,
        category: currentNews.category,
        description: currentNews.description,
        image: currentNews.image,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/news/${currentNews.id}`,
        payload
      );
      const updatedNews = response.data.news;
      setNewsList(
        newsList.map((newsItem) =>
          newsItem.id === updatedNews.id ? updatedNews : newsItem
        )
      );
      toast.success("News updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Error updating news");
      console.error(err);
    }
    setSubmitting(false);
  };

  // Delete a news article.
  const handleDeleteNews = async () => {
    if (!newsToDelete) return;
    setSubmitting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/news/${newsToDelete}`
      );
      setNewsList(newsList.filter((newsItem) => newsItem.id !== newsToDelete));
      toast.success("News deleted successfully");
      setIsDeleteDialogOpen(false);
      setNewsToDelete(null);
    } catch (err) {
      toast.error("Error deleting news");
      console.error(err);
    }
    setSubmitting(false);
  };

  // Reset the form to its default state.
  const resetForm = () => {
    setCurrentNews({
      id: 0,
      title: "",
      category: "",
      description: "",
      image: "",
    });
  };

  // Open the edit dialog pre-populated with the selected news article.
  const openEditDialog = (newsItem) => {
    setCurrentNews(newsItem);
    setIsEditDialogOpen(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to manage news.
            </p>
            <Button asChild>
              <a href="/login">Login</a>
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
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">News Management</h1>
              <p className="text-muted-foreground">Manage your news articles</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add News
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-medium mb-2">
                No news articles found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first news article to get started.
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add News
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  news={newsItem}
                  isAdmin={true}
                  onViewDetails={(item) => {
                    setCurrentNews(item);
                    setIsDetailDialogOpen(true);
                  }}
                  onEdit={(item) => openEditDialog(item)}
                  onDelete={(newsId) => {
                    setNewsToDelete(newsId);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Add News Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsAddDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddNews}>
            <div className="grid gap-4 py-4">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  type="text"
                  value={currentNews.title}
                  onChange={(e) =>
                    setCurrentNews({
                      ...currentNews,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  type="text"
                  value={currentNews.category}
                  onChange={(e) =>
                    setCurrentNews({
                      ...currentNews,
                      category: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  className="textarea"
                  rows={3}
                  value={currentNews.description}
                  onChange={(e) =>
                    setCurrentNews({
                      ...currentNews,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* Image Upload Field */}
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Image
                </label>
                <Input id="image" type="file" onChange={handleFileChange} />
                {imageUploading && <p>Uploading image...</p>}
                {currentNews.image && !imageUploading && (
                  <img
                    src={currentNews.image}
                    alt="Preview"
                    className="mt-2 h-40 object-cover"
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end space-x-4">
                <Button type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || imageUploading}>
                  {submitting ? "Saving..." : "Add News"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditNews}>
            <div className="grid gap-4 py-4">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title-edit" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title-edit"
                  type="text"
                  value={currentNews.title}
                  onChange={(e) =>
                    setCurrentNews({
                      ...currentNews,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="category-edit" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category-edit"
                  type="text"
                  value={currentNews.category}
                  onChange={(e) =>
                    setCurrentNews({
                      ...currentNews,
                      category: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* Description Field */}
              <div className="space-y-2">
                <label
                  htmlFor="description-edit"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="description-edit"
                  className="textarea"
                  rows={3}
                  value={currentNews.description}
                  onChange={(e) =>
                    setCurrentNews({
                      ...currentNews,
                      description: e.target.value,
                    })
                  }
                  required
                />

              </div>
              <div className="space-y-2">
                <label htmlFor="image-edit" className="text-sm font-medium">
                  Image
                </label>
                <Input id="image-edit" type="file" onChange={handleFileChange} />
                {imageUploading && <p>Uploading image...</p>}
                {currentNews.image && !imageUploading && (
                  <img
                    src={currentNews.image}
                    alt="Preview"
                    className="mt-2 h-40 object-cover"
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end space-x-4">
                <Button type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || imageUploading}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the news article "{currentNews.title}" and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNews} disabled={submitting}>
              {submitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* News Detail Dialog */}
      <NewsDetailDialog
        news={currentNews}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />
    </div>
  );
};

export default NewsManagement;
