
import React, { useState } from "react";
import { MapPin, Star, Phone, Clock, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const categories = [
  "All",
  "Restaurants",
  "Education",
  "Healthcare",
  "Retail",
  "Services",
  "Entertainment",
];

const servicesData = [
  {
    id: 1,
    name: "Al Maha Medical Center",
    category: "Healthcare",
    description: "Comprehensive medical services for the whole family",
    address: "Al Nahyan, Abu Dhabi",
    phone: "+971 02 123 4567",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: 2,
    name: "Zayed Learning Center",
    category: "Education",
    description: "Quality education and tutoring services for all levels",
    address: "Al Bateen, Abu Dhabi",
    phone: "+971 02 987 6543",
    hours: "8:00 AM - 6:00 PM",
    rating: 4.6,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: 3,
    name: "Marina Restaurant",
    category: "Restaurants",
    description: "Authentic Emirati cuisine with a modern twist",
    address: "Corniche, Abu Dhabi",
    phone: "+971 02 456 7890",
    hours: "11:00 AM - 11:00 PM",
    rating: 4.9,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: 4,
    name: "Gulf Supermarket",
    category: "Retail",
    description: "Wide selection of groceries and household products",
    address: "Khalidiya, Abu Dhabi",
    phone: "+971 02 345 6789",
    hours: "7:00 AM - 12:00 AM",
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
];

const ServiceCard = ({ service }: { service: typeof servicesData[0] }) => (
  <Card className="overflow-hidden">
    <div className="relative h-48 overflow-hidden">
      <img
        src={service.image}
        alt={service.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute top-4 left-4">
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          {service.category}
        </Badge>
      </div>
    </div>
    <CardHeader>
      <CardTitle>{service.name}</CardTitle>
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="ml-1 mr-1 text-sm font-medium">{service.rating}</span>
        <span className="text-sm text-muted-foreground">({service.reviews} reviews)</span>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-4">{service.description}</CardDescription>
      <div className="space-y-2 text-sm">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{service.address}</span>
        </div>
        <div className="flex items-start">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{service.phone}</span>
        </div>
        <div className="flex items-start">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <span>{service.hours}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="default" fullWidth rightIcon={<MapPin className="h-4 w-4" />}>
        View Details
      </Button>
    </CardFooter>
  </Card>
);

const ServicesDirectory = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = servicesData.filter(
    (service) =>
      (activeCategory === "All" || service.category === activeCategory) &&
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="section-container bg-secondary/50" id="services">
      <div className="mb-12 text-center">
        <h2 className="section-title">Local Services Directory</h2>
        <p className="section-subtitle">
          Discover and connect with trusted businesses and services in your neighborhood
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
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredServices.map((service) => (
          <div 
            key={service.id} 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline"
          size="lg" 
          rightIcon={<Filter className="h-4 w-4" />}
        >
          Browse All Services
        </Button>
      </div>
    </section>
  );
};

export default ServicesDirectory;
