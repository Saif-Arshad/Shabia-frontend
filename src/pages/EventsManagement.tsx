
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import EventCard from "@/components/events/EventCard";
import EventFormDialog from "@/components/events/EventFormDialog";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { Event } from "@/types/event";

const mockEvents: Event[] = [
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
    attendees: 45,
    createdBy: 1
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
    attendees: 120,
    createdBy: 1
  }
];

const EventsManagement = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsDetailOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (isEditing && currentEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === currentEvent.id ? { ...event, ...eventData } : event
        )
      );
    } else {
      // Add new event
      const newEvent = {
        id: Math.max(0, ...events.map((e) => e.id)) + 1,
        title: eventData.title || "",
        description: eventData.description || "",
        date: eventData.date || "",
        startTime: eventData.startTime || "",
        endTime: eventData.endTime || "",
        location: eventData.location || "",
        category: eventData.category || "",
        image: eventData.image || "",
        attendees: 0,
        createdBy: user?.id || 1,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    setIsFormOpen(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view this page.</p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Event Management</h1>
            <p className="text-muted-foreground">Create and manage community events</p>
          </div>
          <Button onClick={handleAddEvent} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => handleEditEvent(event)}
              onDelete={() => handleDeleteEvent(event.id)}
              onView={() => handleViewEvent(event)}
              isManagement
            />
          ))}
        </div>

        {/* Event Form Dialog */}
        <EventFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveEvent}
          event={currentEvent}
          isEditing={isEditing}
        />

        {/* Event Detail Dialog */}
        <EventDetailDialog
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          event={currentEvent}
        />
      </main>
      <Footer />
    </div>
  );
};

export default EventsManagement;
