import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, Building, Clock, Filter, Search, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Job } from "@/types/job";
import JobDetailDialog from "../jobs/JobDetailDialog";




const typeColors = {
  "Full-time": "success",
  "Part-time": "warning",
  "Contract": "secondary",
  "Internship": "primary",
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JobCard = ({ job, onView }: any) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-foreground/80">{job.company}</span>
          </div>
        </div>
        <Badge
        >
          {job.jobType}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-4">{job.description}</CardDescription>
      <div className="space-y-2 text-sm mb-4">
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
        <div className="flex items-start">
          <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{job.salary}</span>
        </div>
       
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Badge variant="outline" >
        {job.category}
      </Badge>
      <Button
        className="w-24"
        onClick={onView}
      >
        View Details
      </Button>
    </CardFooter>
  </Card>
);

const JobBoard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      const filteredPosts = data.posts.filter((post) => post.type === "JOB");

      setJobs(filteredPosts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  };
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };
  useEffect(() => {
    fetchJobs();
  }, []);
  return (
    <section className="section-container bg-secondary/50" id="jobs">
      <div className="mb-12 text-center">
        <h2 className="section-title">Job Opportunities</h2>
        <p className="section-subtitle">
          Find local job openings and career opportunities for graduates and professionals
        </p>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <JobCard
              onView={() => handleViewJob(job)}
              job={job} />
          </div>
        ))}
      </div>

      <JobDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        job={selectedJob}
      />

    </section>
  );
};

export default JobBoard;
