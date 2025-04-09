
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

// Mock news data
const mockNews: News[] = [
  {
    id: 1,
    title: "New Community Park Opening Next Month",
    description: "The long-awaited Al Reem Park will open its doors to the public next month. The park will feature walking trails, children's play areas, and sports facilities.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Community",
    author: "Sarah Ahmed",
    date: "April 5, 2025",
  },
  {
    id: 2,
    title: "Local Business Spotlight: Cafe Harmony",
    description: "Cafe Harmony, a new coffee shop on Al Reem Island, is quickly becoming a favorite spot for locals. Their organic coffee beans and homemade pastries are drawing crowds.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
    category: "Business",
    author: "Mohammed Ali",
    date: "April 4, 2025",
  },
  {
    id: 3,
    title: "New School Opening in September",
    description: "A new international school will be opening its doors this September, offering education from kindergarten to high school with a focus on STEAM subjects.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    category: "Education",
    author: "Fatima Hassan",
    date: "April 2, 2025",
  },
];

const categories = ["All", "Community", "Business", "Education"];

const NewsList = () => {
  const [news, setNews] = useState<News[]>(mockNews);
  const [filteredNews, setFilteredNews] = useState<News[]>(mockNews);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // fetchNews();
  }, []);
  
  useEffect(() => {
    // Filter news by search term and category
    let result = news;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      result = result.filter(item => item.category === selectedCategory);
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
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2"
                >
                  {category}
                </Button>
              ))}
            </div>
            
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
