
import React, { useEffect } from "react";
import { MapPin, Search, Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const serviceCategories = [
  { id: 1, name: "Plumbing", count: 24 },
  { id: 2, name: "Electrical", count: 18 },
  { id: 3, name: "Home Cleaning", count: 32 },
  { id: 4, name: "Gardening", count: 14 },
  { id: 5, name: "Car Repair", count: 22 },
  { id: 6, name: "Tutoring", count: 28 },
];

const featuredServices = [
  {
    id: 1,
    title: "Professional Plumbing Services",
    description: "Expert plumbing solutions for residential and commercial properties. 24/7 emergency services available.",
    location: "Abu Dhabi City",
    category: "Plumbing",
    rating: 4.8,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    title: "Reliable Electrical Contractor",
    description: "Licensed electricians providing installation, repair, and maintenance services for all electrical needs.",
    location: "Khalifa City",
    category: "Electrical",
    rating: 4.6,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    title: "Premium Home Cleaning",
    description: "Top-rated home cleaning services with eco-friendly products and professional staff.",
    location: "Al Reem Island",
    category: "Home Cleaning",
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    title: "Expert Gardening & Landscaping",
    description: "Transform your outdoor space with our professional gardening and landscaping services.",
    location: "Mohamed Bin Zayed City",
    category: "Gardening",
    rating: 4.7,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1599629954294-8897ae9979be?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    title: "Auto Repair Specialists",
    description: "Complete auto repair services for all makes and models. Certified mechanics and quality parts.",
    location: "Mussafah",
    category: "Car Repair",
    rating: 4.5,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    title: "Academic Excellence Tutoring",
    description: "Personalized tutoring for students of all ages. Experienced tutors for all subjects.",
    location: "Al Bateen",
    category: "Tutoring",
    rating: 4.8,
    reviews: 51,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
];

const LocalServices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Local Services in Abu Dhabi</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Connect with trusted local service providers for all your needs
              </p>
              
              {/* Search Bar */}
              <div className="relative flex w-full max-w-2xl mx-auto">
                <Input 
                  placeholder="Search for services..." 
                  className="pr-10 h-12 rounded-l-lg border-r-0"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <Input 
                    placeholder="Location" 
                    className="pl-9 h-12 rounded-none border-x-0"
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <Button className="h-12 rounded-l-none px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {serviceCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-muted-foreground text-sm">{category.count} services</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Service Providers</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-slate-100 relative">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-3 right-3">{service.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-accent mr-1" />
                      <span>{service.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">{service.description}</CardDescription>
                    <div className="flex items-center">
                      <div className="text-amber-500 flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <svg 
                            key={i} 
                            viewBox="0 0 24 24" 
                            fill={i < Math.floor(service.rating) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            className="w-4 h-4"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                        <span className="ml-2">{service.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">({service.reviews} reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg">Load More</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LocalServices;
