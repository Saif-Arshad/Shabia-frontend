
import React, { useState } from "react";
import { Clock, User, Tag, MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const newsData = [
  {
    id: 1,
    title: "New Community Park Opening Next Month",
    description:
      "The long-awaited Al Reem Park will open its doors to the public next month. The park will feature walking trails, children's play areas, and sports facilities.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Community",
    author: "Sarah Ahmed",
    date: "2 hours ago",
    likes: 24,
    comments: 8,
  },

];

const NewsCard = ({ news }: { news: typeof newsData[0] }) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            {news.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="pt-5">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <User className="mr-1 h-3 w-3" />
          <span className="mr-3">{news.author}</span>
          <Clock className="mr-1 h-3 w-3" />
          <span>{news.date}</span>
        </div>
        <CardTitle>{news.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{news.description}</CardDescription>
      </CardContent>
     
    </Card>
  );
};

const NewsFeed = () => {
  return (
    <section className="section-container" id="news">
      <div className="mb-16 text-center">
        <h2 className="section-title">Community News</h2>
        <p className="section-subtitle">
          Stay updated with the latest happenings in your Abu Dhabi community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* {newsData.map((news) => (
          <div 
            key={news.id} 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <NewsCard news={news} />
          </div>
        ))} */}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          size="lg" 
        >
          View All News <Tag className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default NewsFeed;
