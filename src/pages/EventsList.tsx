
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { Event } from "@/types/event";
import { toast } from "sonner";


const EventsList = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [events, setEvents] = useState([]);
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events");
    }
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
            {events.map((event) => (
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
