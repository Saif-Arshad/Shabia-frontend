
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
import ServiceDetailDialog from "@/components/services/ServiceDetailDialog";

const LocalServices = () => {
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  
  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };
  
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
                    <Button className="w-full" onClick={() => handleViewDetails(service)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <ServiceDetailDialog 
        service={selectedService} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default LocalServices;
