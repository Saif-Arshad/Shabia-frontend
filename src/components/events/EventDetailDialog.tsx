/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface EventDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailDialog = ({ isOpen, onClose, event }: any) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  if (!event) return null;
  const handleRSVP = async () => {
    if (!user) {
      toast({
        title: "Login Firts",
        description: `Please Login first to join ${event.title}.`,
      });
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/posts/event`, {
        postId: event.id,
        userId: user.id
      })
      console.log("🚀 ~ handleRSVP ~ res:", res)
      toast({
        title: "RSVP Successful!",
        description: `You have successfully registered for ${event.title}.`,
      });
      onClose();

    } catch (error) {
      console.log("🚀 ~ handleRSVP ~ error:", error)
      toast({
        title: "Errpr!",
        description: error.response.data.message,
      });

    } finally {
      setLoading(false)

    }
  };

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[95vh] overflow-y-auto lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="mr-2">
              {event.category}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-md overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[300px] object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
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
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span>{event.participants.length} people attending</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-foreground/80">{event.description}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={handleRSVP} size="lg">
            {
              loading ? "Joining.." : " RSVP to this Event"
            }

          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
