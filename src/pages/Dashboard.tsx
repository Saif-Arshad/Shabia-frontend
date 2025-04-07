
import React, { useState } from "react";
import { PlusCircle, ListFilter, Search, Calendar, Settings, User, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("services");

  // This would come from API in a real implementation
  const userServices = [];

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
            <p className="text-muted-foreground">Manage your services and account</p>
          </div>
          
          <Tabs defaultValue="services" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="services" onClick={() => setActiveTab("services")}>
                <MapPin className="w-4 h-4 mr-2" /> My Services
              </TabsTrigger>
              <TabsTrigger value="bookings" onClick={() => setActiveTab("bookings")}>
                <Calendar className="w-4 h-4 mr-2" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>
                <User className="w-4 h-4 mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Add New Service Card */}
                <Card className="md:w-1/3 lg:w-1/4">
                  <CardHeader>
                    <CardTitle>Add Local Service</CardTitle>
                    <CardDescription>Create a new listing for your business or service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-6">
                      <PlusCircle size={48} className="text-primary" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to="/dashboard/services/new">Create New Service</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Services Statistics Card */}
                <Card className="md:w-2/3 lg:w-3/4">
                  <CardHeader>
                    <CardTitle>Services Overview</CardTitle>
                    <CardDescription>Track performance of your service listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                        <p className="text-3xl font-bold">{userServices.length || 0}</p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                        <p className="text-3xl font-bold">0</p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Total Enquiries</p>
                        <p className="text-3xl font-bold">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* My Services List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Services</CardTitle>
                    <CardDescription>Manage your service listings</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search..." className="pl-10 w-[200px]" />
                    </div>
                    <Button variant="outline" size="icon">
                      <ListFilter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {userServices.length > 0 ? (
                    <div className="divide-y">
                      {/* Service items would go here */}
                      <p>Your services will appear here</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No services yet</h3>
                      <p className="mt-2 text-muted-foreground">
                        You haven't created any service listings yet.
                      </p>
                      <Button className="mt-6" asChild>
                        <Link to="/dashboard/services/new">Add Your First Service</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>Manage appointment requests and bookings</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Bookings for your services will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 py-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <p className="font-medium md:w-1/4">Name:</p>
                    <p>{user.name}</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <p className="font-medium md:w-1/4">Email:</p>
                    <p>{user.email}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Edit Profile</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Account settings will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
