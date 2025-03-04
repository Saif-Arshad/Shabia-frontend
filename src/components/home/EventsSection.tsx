
import React from "react";
import { Calendar, Clock, MapPin, Users, CalendarDays, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const eventsData = [

  {
    id: 3,
    title: "Tech Startup Networking",
    description: "Connect with local tech entrepreneurs and investors at this networking event.",
    date: "July 5, 2023",
    time: "6:00 PM - 9:00 PM",
    location: "Hub71, Al Maryah Island",
    attendees: 75,
    category: "Business",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
];

const EventCard = ({ event }: { event: typeof eventsData[0] }) => (
  <Card className="group overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
    <div className="relative h-full">
      <img
        src={event.image}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="relative z-20 flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
              {event.category}
            </Badge>
            <div className="glass-panel px-3 py-1 text-sm font-medium flex items-center text-foreground backdrop-blur-md">
              <Users className="h-3 w-3 mr-1" />
              {event.attendees} attending
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
          <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
          <CardDescription className="text-foreground/80 mb-3 line-clamp-2 group-hover:line-clamp-none">
            {event.description}
          </CardDescription>
          <div className="grid grid-cols-2 gap-2 text-sm text-foreground/80 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              {event.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              {event.time}
            </div>
            <div className="flex items-center col-span-2">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              {event.location}
            </div>
          </div>
          <Button variant="default">
            RSVP Now
          </Button>
        </CardFooter>
      </div>
    </div>
  </Card>
);

const EventsSection = () => {
  return (
    <section className="section-container" id="events">
      <div className="mb-12 text-center">
        <h2 className="section-title">Upcoming Events</h2>
        <p className="section-subtitle">
          Discover and participate in local events and activities happening in your community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {eventsData.map((event) => (
          <div 
            key={event.id} 
            className="h-full transform transition-all duration-300 hover:-translate-y-1"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          size="lg" 
        >
          View All Events <CalendarDays className="h-4 w-4" />
        </Button>
        <Button 
          size="lg" 
          className="ml-4" 
        >
          Add Your Event <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default EventsSection;
