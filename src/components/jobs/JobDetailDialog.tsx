/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Building, MapPin, Briefcase, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";

interface JobDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobDetailDialog = ({ isOpen, onClose, job }: any) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[95vh] overflow-y-auto lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="mr-2">
              {job.jobType}
            </Badge>
            <Badge variant="outline">{job.category}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Job Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-3 text-primary" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${job.location1}, ${job.location2}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    {job.location1}, {job.location2}
                  </a>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-3 text-primary" />
                  <span>{job.salary}</span>
                </div>
              
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-foreground/80 whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} size="lg">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailDialog;
