
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { Event } from "@/types/event";

const eventsData: Event[] = [
  {
    id: 1,
    title: "Community Cleanup Drive",
    description: "Join us for a day of community service to clean up local parks and streets.",
    date: "2023-08-15",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    location: "Central Park, Main Entrance",
    category: "Community",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    attendees: 45
  },
  {
    id: 2,
    title: "Tech Meetup: AI Innovation",
    description: "A gathering of tech enthusiasts to discuss the latest in AI technology.",
    date: "2023-09-22",
    startTime: "06:30 PM",
    endTime: "09:00 PM",
    location: "Innovation Hub, Downtown",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    attendees: 120
  },
  {
    id: 3,
    title: "Local Business Networking",
    description: "Connect with local business owners and entrepreneurs. Share ideas, make valuable connections, and grow your business network.",
    date: "2023-07-30",
    startTime: "07:00 PM",
    endTime: "10:00 PM",
    location: "Grand Hotel Conference Room",
    category: "Business",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    attendees: 85
  }
];

const EventsSection = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

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
            <EventCard 
              event={event} 
              onView={() => handleViewEvent(event)}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          size="lg" 
          asChild
        >
          <Link to="/events">
            View All Events <CalendarDays className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button 
          size="lg" 
          className="ml-4" 
          asChild
        >
          <Link to="/dashboard/events">
            Add Your Event <PlusCircle className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <EventDetailDialog 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        event={selectedEvent}
      />
    </section>
  );
};

export default EventsSection;
