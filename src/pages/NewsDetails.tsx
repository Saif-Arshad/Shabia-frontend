
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Clock, Tag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { News } from "@/types/news";
import { toast } from "sonner";
import axios from "axios";

// Mock news data
const mockNews: News[] = [
  {
    id: 1,
    title: "New Community Park Opening Next Month",
    description: "The long-awaited Al Reem Park will open its doors to the public next month. The park will feature walking trails, children's play areas, and sports facilities. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquet nisl, nec aliquam nisl nisl nec. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquet nisl, nec aliquam nisl nisl nec. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquet nisl, nec aliquam nisl nisl nec. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquet nisl, nec aliquam nisl nisl nec.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Community",
    author: "Sarah Ahmed",
    date: "April 5, 2025",
  },
  {
    id: 2,
    title: "Local Business Spotlight: Cafe Harmony",
    description: "Cafe Harmony, a new coffee shop on Al Reem Island, is quickly becoming a favorite spot for locals. Their organic coffee beans and homemade pastries are drawing crowds. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec aliquam aliquam, nisl nisl aliquet nisl, nec aliquam nisl nisl nec.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
    category: "Business",
    author: "Mohammed Ali",
    date: "April 4, 2025",
  },
];

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNewsDetails();
  }, [id]);
  
  const fetchNewsDetails = async () => {
    setLoading(true);
    try {
      // In a real implementation, fetch from API
      // const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/news/${id}`);
      // setNews(response.data);
      
      // Mock implementation
      const foundNews = mockNews.find(item => item.id === Number(id));
      setNews(foundNews || null);
    } catch (err) {
      toast.error("Error fetching news details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!news) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">News Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The news article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/news">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
              </Button>
            </Link>
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
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <Link to="/news">
              <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to All News
              </Button>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <Badge variant="outline" className="rounded-md">
                <Tag className="h-3 w-3 mr-1" /> {news.category}
              </Badge>
              
              {news.author && (
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" /> {news.author}
                </span>
              )}
              
              {news.date && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {news.date}
                </span>
              )}
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden mb-8">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="whitespace-pre-line">{news.description}</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetails;
