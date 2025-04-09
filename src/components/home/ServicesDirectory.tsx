
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { MapPin, Star, Phone, Clock, Filter, Search, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import ServiceDetailDialog from "../services/ServiceDetailDialog";

const ServiceCard = ({ service, onViewDetails }: { service: any, onViewDetails: () => void }) => (
  <Card className="overflow-hidden">
    <div className="relative h-48 overflow-hidden">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute top-4 left-4">
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          {service.category}
        </Badge>
      </div>
    </div>
    <CardHeader>
      <CardTitle>{service.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-4">{service.description}</CardDescription>
      <div className="space-y-2 text-sm">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{service.location}</span>
        </div>
        <div className="flex items-start">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{service.contactPhone}</span>
        </div>
        <div className="flex items-start">
          <Mail className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{service.contactEmail}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="default" onClick={onViewDetails}>
        View Details <MapPin className="h-4 w-4 ml-2" />
      </Button>
    </CardFooter>
  </Card>
);

const ServicesDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/`);
      console.log(response.data)
      if (response.data.services) {
        setServices(response.data.services.slice(0,3));
      } else {
        setServices([]);
      }
    } catch (err) {
      toast.error("Error fetching services");
      console.error(err);
    }
    setLoadingServices(false);
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchServices()
  }, [])
  
  return (
    <section className="section-container bg-secondary/50" id="services">
      <div className="mb-12 text-center">
        <h2 className="section-title">Local Services Directory</h2>
        <p className="section-subtitle">
          Discover and connect with trusted businesses and services in your neighborhood
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-8">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <ServiceCard 
              service={service} 
              onViewDetails={() => handleViewDetails(service)}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to={"/local-services"}>
        <Button
          variant="outline"
          size="lg"
          >
          Browse All Services <Filter className="h-4 w-4 ml-2" />
        </Button>
          </Link>
      </div>

      <ServiceDetailDialog 
        service={selectedService} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
      />
    </section>
  );
};

export default ServicesDirectory;
