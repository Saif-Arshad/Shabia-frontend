
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Card for displaying a Service post, matches directory style
const ServiceCard = ({ service, onViewDetails }: { service: any; onViewDetails: () => void }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          {service.location1}, {service.location2}
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

export default ServiceCard;
