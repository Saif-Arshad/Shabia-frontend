
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
            <p className="text-muted-foreground">Manage your account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/users" className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-mathpath-purple" />
                    Manage Services
                  </CardTitle>
                  <CardDescription>View and manage Services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    View , Delete , Add and edit your Services
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
