
import React from "react";
import { Calendar, Clock, MapPin, Users, Edit, Trash, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onView: () => void;
  isManagement?: boolean;
}

const EventCard = ({ event, onEdit, onDelete, onView, isManagement = false }: EventCardProps) => {
  return (
    <Card className="group overflow-hidden relative h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      <div className="relative h-48">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 z-20">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            {event.category}
          </Badge>
        </div>
        {isManagement && (
          <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white" onClick={onDelete}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white" onClick={onView}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <CardHeader className="pt-4">
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="text-sm text-foreground/70">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-primary" />
            <span>{new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {event.attendees !== undefined && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span>{event.attendees} attending</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isManagement && (
          <Button 
            className="w-full" 
            onClick={onView}
          >
            RSVP Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
