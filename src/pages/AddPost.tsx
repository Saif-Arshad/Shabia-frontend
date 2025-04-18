
import React, { useState } from "react";
import { Package, FileText, CalendarDays, Briefcase } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const postTypes = [
  {
    id: "NEWS",
    title: "News Article",
    description: "Share important news and updates with the community",
    icon: FileText,
  },
  {
    id: "EVENT",
    title: "Event",
    description: "Create and manage community events",
    icon: CalendarDays,
  },
  {
    id: "JOB",
    title: "Job Posting",
    description: "Post job opportunities and career openings",
    icon: Briefcase,
  },
  {
    id: "SERVICE",
    title: "Service",
    description: "Offer services to the community",
    icon: Package,
  },
];

const AddPost = () => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("NEWS");

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to create posts.
            </p>
            <Button asChild>
              <Link to="/login">Login</Link>
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
      <main className="flex-grow pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">Select the type of post you want to create</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {postTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedType === type.id
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:border-primary"
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 rounded-full ${
                      selectedType === type.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </Card>
              )}
            )}
          </div>

          {/* Form container - to be implemented based on selected type */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Create {selectedType.toLowerCase()}
            </h2>
            {/* Form components will be added here in the next step */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddPost;
