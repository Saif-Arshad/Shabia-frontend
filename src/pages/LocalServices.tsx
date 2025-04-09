
import React, { useEffect, useState } from "react";
import { MapPin, Search, Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";


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
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/`);
      console.log(response.data)
      if (response.data.services) {
        setServices(response.data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      toast.error("Error fetching services");
      console.error(err);
    }
    setLoadingServices(false);
  };
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Local Services in Abu Dhabi</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Connect with trusted local service providers for all your needs
              </p>

              <div className="relative flex w-full max-w-2xl mx-auto">
                <Input
                  placeholder="Search for services..."
                  className="pl-10 h-12 rounded-l-lg border-r-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>

                <Button className="h-12 rounded-l-none px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>


        <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Service Providers</h2>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-slate-100 relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-3 capitalize right-3">{service.category}</Badge>
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
                   
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LocalServices;
