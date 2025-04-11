
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { Event } from "@/types/event";
import { toast } from "sonner";

const EventsSection = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [events, setEvents] = useState([]);

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.events.slice(0, 3));
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events");
    }
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
        {events.map((event) => (
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

      <div className="mt-8 flex justify-center">
        <Link to="/events">
          <Button variant="outline" className="mr-4">
            <CalendarDays className="mr-2 h-4 w-4" />
            View All Events
          </Button>
        </Link>
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
