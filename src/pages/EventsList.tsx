
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { Event } from "@/types/event";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Community Cleanup Drive",
    description: "Join us for a day of community service to clean up local parks and streets. Supplies will be provided, just bring your enthusiasm and help make our community cleaner!",
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
    description: "A gathering of tech enthusiasts to discuss the latest in AI technology. Speakers from leading tech companies will present their latest research and innovations.",
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

const EventsList = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Community Events</h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Discover and participate in local events happening in your community. 
              Connect with neighbors and make your area a better place to live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mockEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                onView={() => handleViewEvent(event)}
              />
            ))}
          </div>
        </div>

        <EventDetailDialog 
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          event={selectedEvent}
        />
      </main>
      <Footer />
    </div>
  );
};

export default EventsList;
