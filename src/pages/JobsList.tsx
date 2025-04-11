
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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, activeCategory, searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch jobs from the backend
      // const response = await fetch(`${BACKEND_URL}/jobs`);
      // const data = await response.json();
      // setJobs(data.jobs);
      
      // For now, use mock data
      setJobs(mockJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    const filtered = jobs.filter(
      (job) =>
        (activeCategory === "All" || job.category === activeCategory) &&
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(filtered);
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

          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-primary text-white"
                        : "bg-white hover:bg-secondary"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="transform transition-all duration-300 hover:-translate-y-1"
                >
                  <JobCard job={job} onView={() => handleViewJob(job)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || activeCategory !== "All" 
                  ? "Try adjusting your filters" 
                  : "Check back later for new opportunities"}
              </p>
            </div>
          )}
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
