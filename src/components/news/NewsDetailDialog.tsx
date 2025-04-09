
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  news:any;
  isOpen: boolean;
  onClose: () => void;
}

const NewsDetailDialog = ({ news, isOpen, onClose }: NewsDetailDialogProps) => {
  console.log("🚀 ~ NewsDetailDialog ~ news:", news)
  if (!news) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[95vh] overflow-y-auto lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{news.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="mr-2 capitalize">{news.category}</Badge>
            {news.user && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-3">{news.user.name}</span>
              </div>
            )}
            {news.createdAt && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{new Date(news.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
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
