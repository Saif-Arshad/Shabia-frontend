
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import NewsCard from "@/components/news/NewsCard";
import NewsForm from "@/components/news/NewsForm";
import { News } from "@/types/news";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import axios from "axios";
import NewsDetailDialog from "@/components/news/NewsDetailDialog";

// Mock news data - replace with API calls
const mockNews: News[] = [
  {
    id: 1,
    title: "New Community Park Opening Next Month",
    description: "The long-awaited Al Reem Park will open its doors to the public next month. The park will feature walking trails, children's play areas, and sports facilities.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Community",
    author: "Sarah Ahmed",
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Local Business Spotlight: Cafe Harmony",
    description: "Cafe Harmony, a new coffee shop on Al Reem Island, is quickly becoming a favorite spot for locals. Their organic coffee beans and homemade pastries are drawing crowds.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
    category: "Business",
    author: "Mohammed Ali",
    date: "1 day ago",
  },
];

const NewsManagement = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<News[]>(mockNews);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // In a real implementation, fetch news from API
  useEffect(() => {
    // fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/news/`);
      // setNews(response.data.news || []);
    } catch (err) {
      toast.error("Error fetching news");
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddNews = async (newsData: News) => {
    setSubmitting(true);
    try {
      // In a real app, make an API call to create the news
      // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/news/`, newsData);
      
      // Mock implementation
      const newNews = {
        ...newsData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        author: user?.name || "Anonymous",
      };
      
      setNews([newNews, ...news]);
      toast.success("News created successfully");
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error("Error creating news");
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleUpdateNews = async (newsData: News) => {
    setSubmitting(true);
    try {
      // In a real app, make an API call to update the news
      // await axios.put(`${import.meta.env.VITE_BACKEND_URL}/news/${newsData.id}`, newsData);
      
      // Mock implementation
      setNews(news.map(item => item.id === newsData.id ? newsData : item));
      toast.success("News updated successfully");
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error("Error updating news");
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDeleteNews = async () => {
    if (!currentNews?.id) return;
    
    setSubmitting(true);
    try {
      // In a real app, make an API call to delete the news
      // await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/news/${currentNews.id}`);
      
      // Mock implementation
      setNews(news.filter(item => item.id !== currentNews.id));
      toast.success("News deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (err) {
      toast.error("Error deleting news");
      console.error(err);
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to manage news.</p>
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
              <p className="text-muted-foreground">Create and manage community news</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add News
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-medium mb-2">No news articles yet</h3>
              <p className="text-muted-foreground mb-4">Create your first news article to get started.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add News
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  isAdmin={true}
                  onViewDetails={(news) => {
                    setCurrentNews(news);
                    setIsDetailDialogOpen(true);
                  }}
                  onEdit={(news) => {
                    setCurrentNews(news);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={(newsId) => {
                    const newsToDelete = news.find(item => item.id === newsId);
                    if (newsToDelete) {
                      setCurrentNews(newsToDelete);
                      setIsDeleteDialogOpen(true);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Add News Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
          </DialogHeader>
          <NewsForm
            onSubmit={handleAddNews}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
          </DialogHeader>
          <NewsForm
            initialData={currentNews || undefined}
            onSubmit={handleUpdateNews}
            onCancel={() => setIsEditDialogOpen(false)}
            isSubmitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the news article "{currentNews?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteNews}
              disabled={submitting}
            >
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
