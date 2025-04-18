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



const Community = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<any>(null);
  useEffect(() => {
    const path = window.location.pathname;
    const groupParam = path.split('/').pop();
    console.log("🚀 ~ useEffect ~ groupParam:", groupParam)
    setGroup(groupParam);
  }, []);
  const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const fetchGroup = async () => {
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/groups/${group}`);
      if (!response.ok) throw new Error("Failed to fetch group");
      const data = await response.json();
      console.log("🚀 ~ fetchGroup ~ data:", data)
      setGroupData(data);
    } catch (error) {
      console.log("Error fetching group:", error);
      toast({
        title: "Error",
        description: "Failed to load group",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    if (group) {
      fetchGroup()
    }
  }, [group])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/user/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      console.log("🚀 ~ fetchMessages ~ data:", data)
      console.log("🚀 ~ fetchMessages ~ data:", group)
      const filteredCUrrentGroupMessages = data.filter((message: any) => Number(message.groupId) == Number(group))
      console.log("🚀 ~ fetchMessages ~ filteredCUrrentGroupMessages:", filteredCUrrentGroupMessages)

      setMessages(filteredCUrrentGroupMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if(group){
      fetchMessages();
    }
  }, [group]);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("newMessage", (message: any) => {
      const isCurrentGroupMessage = Number(message.groupId) == Number(group);
      console.log("🚀 ~ socketRef.current.on ~ isCurrentGroupMessage:", isCurrentGroupMessage)
      if (!isCurrentGroupMessage) return;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current.on("errorMessage", (errorMsg: string) => {
      console.error("Socket error:", errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [SOCKET_SERVER_URL, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages",
        variant: "destructive",
      });
      return;
    }

    const messageData = {
      createdBy: user.id,
      message: newMessage,
      groupId: group,
    };

    socketRef.current.emit("sendMessage", messageData);

    setNewMessage("");

    toast({
      title: "Message sent",
      description: "Your message has been posted to the community",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      date.toLocaleDateString()
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="space-y-6">
          {groupData && (
            <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">{groupData.name}</h1>
              <p className="text-sm text-muted-foreground mb-4">
                {groupData.location1}, {groupData.location2}
              </p>
              <div className="flex gap-6 items-center text-sm">
                <span>
                  Created:{" "}
                  {new Date(groupData.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Participants: {groupData.GroupParticipant?.length ?? 0}
                </span>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-9 w-9 text-gray-400 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{groupData.admin.name}</p>
                    <p className="text-xs text-gray-500">{groupData.admin.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* <div className="text-center">
            <h1 className="text-4xl font-bold">Community Messages</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Connect with other community members
            </p>
          </div> */}

          <div className="bg-card border rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Community Chat</h2>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <Card
                  key={message.id}
                  className={`${user && message.createdBy === user.id
                    ? "ml-auto bg-primary/10"
                    : "mr-auto"
                    } max-w-[85%]`}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{message.user.name}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </CardContent>
                </Card>
              ))}
              {/* This empty div serves as the scroll target */}
              <div ref={messagesEndRef} />
            </div>

            <CardFooter className="border-t p-3">
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder={user ? "Type your message..." : "Login to send messages"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!user}
                  className="min-h-10 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!user || !newMessage.trim()}
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </div>

          {!user && (
            <div className="text-center mt-4">
              <p className="text-muted-foreground mb-2">
                You need to be logged in to participate in the community chat.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href="/login">Log In</a>
                </Button>
                <Button asChild>
                  <a href="/register">Sign Up</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Community;
