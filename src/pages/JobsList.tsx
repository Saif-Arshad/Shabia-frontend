
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import JobDetailDialog from "@/components/jobs/JobDetailDialog";
import { Job } from "@/types/job";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "IT & Software", 
  "Engineering",
  "Education",
  "Healthcare",
  "Business",
  "Marketing",
  "Other"
];

const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp",
    location: "Abu Dhabi, UAE",
    type: "Full-time",
    category: "IT & Software",
    salary: "AED 18,000 - 25,000 / month",
    posted: "April 1, 2025",
    deadline: "May 15, 2025",
    description: "We are looking for an experienced Software Engineer to join our team. You will be responsible for developing and maintaining web applications.",
    createdBy: 1
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Global Marketing",
    location: "Dubai, UAE",
    type: "Full-time",
    category: "Marketing",
    salary: "AED 15,000 - 20,000 / month",
    posted: "April 3, 2025",
    deadline: "April 30, 2025",
    description: "We are seeking a creative Marketing Manager to lead our marketing team and develop marketing strategies to promote our products and services.",
    createdBy: 1
  },
  {
    id: 3,
    title: "Elementary School Teacher",
    company: "International Academy",
    location: "Sharjah, UAE",
    type: "Full-time",
    category: "Education",
    salary: "AED 12,000 - 16,000 / month",
    posted: "April 2, 2025",
    deadline: "May 1, 2025",
    description: "We're looking for a passionate Elementary School Teacher to join our international school. You'll be responsible for creating lesson plans and teaching a variety of subjects to students.",
    createdBy: 2
  },
  {
    id: 4,
    title: "Civil Engineer",
    company: "Emirates Construction",
    location: "Yas Island, Abu Dhabi",
    type: "Contract",
    category: "Engineering",
    salary: "AED 15,000 - 20,000 / month",
    posted: "April 5, 2025",
    deadline: "July 10, 2025",
    description: "Experienced Civil Engineer needed for our upcoming infrastructure projects across Abu Dhabi. You will be involved in planning, designing, and overseeing construction projects.",
    createdBy: 2
  }
];

const JobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  




  const fetchJobs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/jobs`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data.jobs.slice(0, 3));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  };
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-center mb-2">Job Opportunities</h1>
            <p className="text-xl text-center text-muted-foreground">
              Find local job openings and career opportunities
            </p>
          </div>

        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="transform transition-all duration-300 hover:-translate-y-1"
                >
                  <JobCard job={job} onView={() => handleViewJob(job)} />
                </div>
              ))}
            </div>
        
        </div>
      </main>

      <JobDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        job={selectedJob}
      />
      
      <Footer />
    </div>
  );
};

export default JobsList;
