/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import io from "socket.io-client";

const Community: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupData, setGroupData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Parse the group ID from the URL
  useEffect(() => {
    const last = window.location.pathname.split("/").pop();
    const n = last ? parseInt(last, 10) : NaN;
    if (!isNaN(n)) setGroupId(n);
  }, []);

  // Fetch the group and its messages
  useEffect(() => {
    if (groupId === null) return;
    (async () => {
      try {
        const res = await fetch(`${API}/groups/${groupId}`);
        if (!res.ok) throw new Error("Failed to fetch group");
        const data = await res.json();
        setGroupData(data);
        setMessages(data.Messages || []);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not load group details",
          variant: "destructive",
        });
      }
    })();
  }, [groupId]);

  // Set up socket.io
  useEffect(() => {
    if (groupId === null) return;
    socketRef.current = io(API);
    socketRef.current.emit("joinGroup", { groupId });

    socketRef.current.on("newMessage", (msg: any) => {
      if (msg.groupId === groupId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socketRef.current.on("errorMessage", (err: string) =>
      toast({ title: "Error", description: err, variant: "destructive" })
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !user || groupId === null) return;
    socketRef.current.emit("sendMessage", {
      createdBy: user.id,
      groupId,
      message: newMessage.trim(),
    });
    setNewMessage("");
  };

  const formatDate = (iso: string) =>
    `${new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${new Date(iso).toLocaleDateString()}`;

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Layout>
          <div className="text-center py-24">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p>You must be logged in to view this page.</p>
            <Button asChild className="mt-4">
              <a href="/login">Log In</a>
            </Button>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 space-y-8">
        {/* Group Header */}
        {groupData && (
          <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">{groupData.name}</h1>
            <p className="text-sm text-muted-foreground">
              {groupData.location1}, {groupData.location2}
            </p>
            <p className="text-xs mt-2">
              Created on {new Date(groupData.createdAt).toLocaleDateString()} ·{' '}
              {groupData.GroupParticipant?.length || 0} participants
            </p>
          </div>
        )}

        {/* Chat Box */}
        <div className="bg-card border rounded-lg shadow max-w-4xl mx-auto">
          <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Group Chat</h2>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <Card
                key={m.id}
                className={`max-w-[85%] ${m.createdBy === user.id ? 'ml-auto bg-primary/10' : 'mr-auto'
                  }`}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">
                      {m.user?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{m.message}</p>
                </CardContent>
              </Card>
            ))}
            <div ref={endRef} />
          </div>

          <CardFooter className="border-t p-3 w-full">
            <div className="flex gap-2 w-full">
              <Textarea
                className="flex-1"
                placeholder="Type your message…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button onClick={handleSend} size="icon" disabled={!newMessage.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
