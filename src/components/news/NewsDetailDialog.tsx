
import React from "react";
import { Tag, User, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { News } from "@/types/news";

interface NewsDetailDialogProps {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsDetailDialog = ({ news, isOpen, onClose }: NewsDetailDialogProps) => {
  if (!news) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{news.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="mr-2">{news.category}</Badge>
            {news.author && (
              <div className="flex items-center text-sm">
                <User className="h-3 w-3 mr-1" />
                <span className="mr-3">{news.author}</span>
              </div>
            )}
            {news.date && (
              <div className="flex items-center text-sm">
                <Clock className="h-3 w-3 mr-1" />
                <span>{news.date}</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="rounded-md overflow-hidden">
            <img 
              src={news.image} 
              alt={news.title}
              className="w-full h-[300px] object-cover" 
            />
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300">{news.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsDetailDialog;
