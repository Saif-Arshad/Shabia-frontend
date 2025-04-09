
import React, { useEffect, useState } from "react";
import { Clock, User, Tag, MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/custom/Card";
import { Badge } from "@/components/custom/Badge";
import { Button } from "@/components/custom/Button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import NewsDetailDialog from "../news/NewsDetailDialog";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NewsCard = ({ news, onViewDetails }: any) => {

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-white/80 capitalize backdrop-blur-sm">
            {news.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="pt-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <User className="mr-1 h-3 w-3" />
          <span className="mr-3 capitalize">{news.user.name}</span>
          <Clock className="mr-1 h-3 w-3" />
          <span>{
            new Date(news.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</span>
        </div>
        <CardTitle>{news.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {news.description.length > 100
            ? `${news.description.slice(0, 100)}...`
            : news.description}
        </CardDescription>
      </CardContent>
      <CardFooter >

        <Button
          onClick={() => onViewDetails && onViewDetails(news)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const NewsFeed = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [currentNews, setCurrentNews] = useState({
    id: 0,
    title: "",
    category: "",
    description: "",
    image: "",
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/news/`);
      console.log(response.data)
      if (response.data.news) {
        setNews(response.data.news.slice(0,3));
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
  return (
    <section className="section-container" id="news">
      <div className="mb-16 text-center">
        <h2 className="section-title">Community News</h2>
        <p className="section-subtitle">
          Stay updated with the latest happenings in your Abu Dhabi community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
        {news.map((news) => (
          <div
            key={news.id}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <NewsCard news={news} onViewDetails={(item) => {
              setCurrentNews(item);
              setIsDetailDialogOpen(true);
            }} />
          </div>
        ))}
      </div>
      <NewsDetailDialog
        news={currentNews}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />
      <div className="mt-12 text-center">
        <Link to={'/news'}>
          <Button
            variant="outline"
            size="lg"
          >
            View All News <Tag className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default NewsFeed;
