
import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, FileText, CalendarDays } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const isMODERATOR = user?.role == "MODERATOR"

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view this page.</p>
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
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Manage Users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              isMODERATOR ?
                <Link to="/dashboard/post" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Manage Posts
                  </CardTitle>
                  <CardDescription>View and manage users posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                        Add, edit, delete and view users published posts
                  </p>
                </CardContent>
              </Card>
            </Link>
            :
            <>
            <Link to="/dashboard/users" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Manage Users
                  </CardTitle>
                  <CardDescription>View and manage users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Add, edit, delete and view shabia users
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/groups" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Manage Groups
                  </CardTitle>
                        <CardDescription>View and manage your Groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                          Add, edit, delete and view your published Groups
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            </>
            }
         
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
