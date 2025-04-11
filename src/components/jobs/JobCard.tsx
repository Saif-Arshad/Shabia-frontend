
import React from "react";
import { Briefcase, Building, MapPin, Clock, Edit, Trash, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onEdit?: () => void;
  onDelete?: () => void;
  onView: () => void;
  isManagement?: boolean;
}

const JobCard = ({ job, onEdit, onDelete, onView, isManagement = false }: JobCardProps) => {
  return (
    <Card className="group overflow-hidden relative h-full flex flex-col">
      <CardHeader className="pt-4">
        <div className="absolute top-2 right-2">
          <Badge variant="outline">{job.type}</Badge>
        </div>
        {isManagement && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white" onClick={onDelete}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white" onClick={onView}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <CardTitle className="line-clamp-2">{job.title}</CardTitle>
        <CardDescription className="text-sm text-foreground/70">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1 text-primary" />
            <span>{job.company}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{job.description}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-primary" />
            <span>{job.salary}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isManagement && (
          <Button
            className="w-full"
            onClick={onView}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
