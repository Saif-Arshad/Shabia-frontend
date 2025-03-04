
import React, { useState } from "react";
import { Clock, User, Tag, MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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
  {
    id: 2,
    title: "Road Closure Alert: Al Nahyan Area",
    description:
      "Due to ongoing infrastructure improvements, several roads in Al Nahyan area will be closed during weekends for the next month. Plan your routes accordingly.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Traffic Updates",
    author: "Mohammed Kareem",
    date: "5 hours ago",
    likes: 18,
    comments: 12,
  },
  {
    id: 3,
    title: "Local Business Spotlight: Cafe Arabica",
    description:
      "Cafe Arabica, a locally-owned coffee shop, is celebrating its grand opening this weekend with special offers and live music performances.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    category: "Business",
    author: "Fatima Al Hashemi",
    date: "Yesterday",
    likes: 42,
    comments: 5,
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
      <CardFooter className="justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center text-sm ${liked ? 'text-blue-500' : 'text-muted-foreground'} hover:text-blue-500 transition-colors`}
            onClick={() => setLiked(!liked)}
          >
            <ThumbsUp className="mr-1 h-4 w-4" />
            <span>{liked ? news.likes + 1 : news.likes}</span>
          </button>
          <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="mr-1 h-4 w-4" />
            <span>{news.comments}</span>
          </button>
        </div>
        <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </button>
      </CardFooter>
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
        {newsData.map((news) => (
          <div 
            key={news.id} 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <NewsCard news={news} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          size="lg" 
          rightIcon={<Tag className="h-4 w-4" />}
        >
          View All News
        </Button>
      </div>
    </section>
  );
};

export default NewsFeed;
