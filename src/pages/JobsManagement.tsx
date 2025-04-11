
import React, { useState, useEffect } from "react";
import { PlusCircle, Briefcase } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import JobFormDialog from "@/components/jobs/JobFormDialog";
import JobDetailDialog from "@/components/jobs/JobDetailDialog";
import { Job } from "@/types/job";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

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
  }
];

const JobsManagement = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

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

  const handleCreateJob = async (jobData: any) => {
    try {
      // In a real app, you would POST to the backend
      // const response = await fetch(`${BACKEND_URL}/jobs`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(jobData),
      // });
      // const data = await response.json();
      
      // For now, add to the local state
      const newJob = {
        ...jobData,
        id: Date.now(),
        createdBy: user?.id,
      };
      
      setJobs([newJob, ...jobs]);
      toast.success("Job posted successfully!");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job");
    }
  };

  const handleEditJob = async (jobData: any) => {
    try {
      // In a real app, you would PUT to the backend
      // const response = await fetch(`${BACKEND_URL}/jobs/${jobData.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(jobData),
      // });
      // const data = await response.json();
      
      // For now, update the local state
      const updatedJobs = jobs.map((job) =>
        job.id === jobData.id ? { ...job, ...jobData } : job
      );
      
      setJobs(updatedJobs);
      toast.success("Job updated successfully!");
      setIsFormOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      // In a real app, you would DELETE to the backend
      // await fetch(`${BACKEND_URL}/jobs/${jobId}`, {
      //   method: "DELETE",
      // });
      
      // For now, update the local state
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const openCreateForm = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const openEditForm = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const openViewDialog = (job: Job) => {
    setSelectedJob(job);
    setIsViewOpen(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view this page.</p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manage Jobs</h1>
              <p className="text-muted-foreground">Create and manage job posts for the community</p>
            </div>
            <Button onClick={openCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id}>
                  <JobCard
                    job={job}
                    onEdit={() => openEditForm(job)}
                    onDelete={() => handleDeleteJob(job.id)}
                    onView={() => openViewDialog(job)}
                    isManagement
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-4">Post your first job to help community members find opportunities</p>
              <Button onClick={openCreateForm}>Post a Job</Button>
            </div>
          )}
        </div>
      </main>

      <JobFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={selectedJob ? handleEditJob : handleCreateJob}
        job={selectedJob}
      />

      <JobDetailDialog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        job={selectedJob}
      />

      <Footer />
    </div>
  );
};

export default JobsManagement;
