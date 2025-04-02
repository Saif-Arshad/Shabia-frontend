import React, { useState } from "react";
import { Briefcase, MapPin, Building, Clock, Filter, Search, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "IT & Software", 
  "Engineering",
  "Education",
  "Healthcare",
  "Business",
  "Marketing",
];

const jobsData = [
  {
    id: 4,
    title: "Civil Engineer",
    company: "Emirates Construction",
    location: "Yas Island, Abu Dhabi",
    type: "Contract",
    category: "Engineering",
    salary: "AED 15,000 - 20,000 / month",
    posted: "5 days ago",
    deadline: "July 10, 2023",
    description: "Experienced Civil Engineer needed for our upcoming infrastructure projects across Abu Dhabi.",
  },
];

const typeColors = {
  "Full-time": "success",
  "Part-time": "warning",
  "Contract": "secondary",
  "Internship": "primary",
} as const;

const JobCard = ({ job }: { job: typeof jobsData[0] }) => (
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
          {job.type}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-4">{job.description}</CardDescription>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-start">
          <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-start">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>Posted {job.posted} • Apply by {job.deadline}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Badge variant="outline" >
        {job.category}
      </Badge>
      <Button variant="default" size="sm" >
        Apply Now <BookOpen className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

const JobBoard = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobsData.filter(
    (job) =>
      (activeCategory === "All" || job.category === activeCategory) &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section className="section-container bg-secondary/50" id="jobs">
      <div className="mb-12 text-center">
        <h2 className="section-title">Job Opportunities</h2>
        <p className="section-subtitle">
          Find local job openings and career opportunities for graduates and professionals
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          size="lg" 
        >
          Browse All Jobs <Filter className="h-4 w-4" />
        </Button> 
        <Button 
          size="lg" 
          className="ml-4" 
        >
          Post a Job <Briefcase className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default JobBoard;
