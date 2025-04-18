/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";



const ServiceDetailDialog = ({ service, isOpen, onClose }: any) => {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{service.title}</DialogTitle>
          <DialogDescription>
            <Badge variant="outline" className="mb-2">{service.category}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md overflow-hidden">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-64 object-cover" 
            />
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">{service.description}</p>
            
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${service.location1}, ${service.location2}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {service.location1}, {service.location2}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>{service.contactPhone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>{service.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailDialog;
