
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NewsCard from "@/components/news/NewsCard";
import { News } from "@/types/news";
import NewsDetailDialog from "@/components/news/NewsDetailDialog";
import { Search, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";


const NewsList = () => {
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  console.log("🚀 ~ NewsList ~ filteredNews:", filteredNews)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
    const [news, setNews] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/news/`);
      console.log(response.data)
      if (response.data.news) {
        setNews(response.data.news);
      } else {
        setNews([]);
      }
    } catch (err) {
      toast.error("Error fetching services");
      console.error(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchNews()
  }, [])
  useEffect(() => {
    let result = news;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNews(result);
  }, [searchTerm, selectedCategory, news]);
  
  const handleViewDetails = (news: News) => {
    setSelectedNews(news);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Community News</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Stay updated with the latest happenings in your community
              </p>

              <div className="relative flex w-full max-w-2xl mx-auto">
                <Input
                  placeholder="Search for news..."
                  className="pl-10 h-12 rounded-l-lg border-r-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>

                <Button className="h-12 rounded-l-none px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No news found</h3>
                  <p className="text-muted-foreground">Try changing your search or filters</p>
                </div>
              ) : (
                filteredNews.map(item => (
                  <div key={item.id} className="transform transition-all duration-300 hover:-translate-y-1">
                    <NewsCard 
                      news={item} 
                      onViewDetails={() => handleViewDetails(item)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <NewsDetailDialog
        news={selectedNews}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />
    </div>
  );
};

export default NewsList;
