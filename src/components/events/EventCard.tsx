/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Calendar, Clock, MapPin, Users, Edit, Trash, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";



const EventCard = ({ event, isPost, onEdit, onDelete, onView, isManagement = false }: any) => {
  return (
    <Card className="group overflow-hidden relative h-full flex flex-col">
      {
        !isPost ?
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
          :
          <div className="relative top-2 right-2 m-2 z-20">
            <Badge variant="outline" className="text-white bg-primary ml-4 backdrop-blur-sm">
              {event.category}
            </Badge>
          </div>
      }
      <CardHeader className="pt-4">
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="text-sm text-foreground/70">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-primary" />
            <span>{new Date(event.eventDate).toLocaleDateString('en-US', {
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
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location1}, ${event.location2}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              {event.location1}, {event.location2}
            </a>
          </div>
          {event.participants !== undefined && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span>{event.participants.length} attending</span>
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
            View Detail
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
