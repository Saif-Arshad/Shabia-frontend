
import React from "react";
import { User, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { News } from "@/types/news";

interface NewsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  news: any;
  onViewDetails?: (news: News) => void;
  isAdmin?: boolean;
  onEdit?: (news: News) => void;
  onDelete?: (newsId: number) => void;
}

const NewsCard = ({ news, onViewDetails, isAdmin = false, onEdit, onDelete }: NewsCardProps) => {
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
        <div className="flex items-center text-sm text-gray-500 mb-2">
          {news.user && (
            <>
              <User className="mr-1 h-3.5 w-3.5" />
              <span className="mr-3">{news.user.name}</span>
            </>
          )}
          {news.createdAt && (
            <>
              <Clock className="mr-1 h-3 w-3" />
              <span>{new Date(news.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}</span>
            </>
          )}
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
      <CardFooter className={isAdmin ? "flex justify-between" : ""}>
        <Button 
          variant={isAdmin ? "outline" : "default"} 
          onClick={() => onViewDetails && onViewDetails(news)}
        >
          View Details
        </Button>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit && onEdit(news)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete && news.id && onDelete(news.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
