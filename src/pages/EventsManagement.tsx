import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import EventCard from "@/components/events/EventCard";
import EventFormDialog from "@/components/events/EventFormDialog";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EventsManagement = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/events/my/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events");
    }
  };

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewEvent = (event) => {
    setCurrentEvent(event);
    setIsDetailOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/events/${eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      toast.success("Event deleted successfully");
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (isEditing && currentEvent) {
        // Update existing event via PUT
        const res = await fetch(`${BACKEND_URL}/events/${currentEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...eventData,
            createdBy: user.id,
          }),
        });
        if (!res.ok) throw new Error("Failed to update event");
        const updated = await res.json();
        toast.success("Event updated successfully");
        setEvents(prev =>
          prev.map(e => (e.id === currentEvent.id ? updated.event : e))
        );
      } else {
        // Create new event via POST
        const res = await fetch(`${BACKEND_URL}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...eventData,
            createdBy: user.id,
          }),
        });
        if (!res.ok) throw new Error("Failed to create event");
        const newEv = await res.json();
        toast.success("Event created successfully");
        setEvents(prev => [...prev, newEv.event]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Error saving event");
    }
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

        <EventFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveEvent}
          event={currentEvent}
          isEditing={isEditing}
        />

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
