
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";

// Mock data for messages - in a real app, this would come from a database
const initialMessages = [
  {
    id: "1",
    userId: "user1",
    userName: "Jane Cooper",
    content: "Hello everyone! I'm new to this community.",
    timestamp: new Date(Date.now() - 60000 * 60).toISOString(),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Alex Johnson",
    content: "Welcome, Jane! Great to have you here. Feel free to ask any questions.",
    timestamp: new Date(Date.now() - 30000 * 60).toISOString(),
  },
  {
    id: "3",
    userId: "user3",
    userName: "Sarah Williams",
    content: "Has anyone attended the community meetup last weekend?",
    timestamp: new Date(Date.now() - 15000 * 60).toISOString(),
  },
];

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

const Community = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

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

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id || "current-user",
      userName: user.name || "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been posted to the community",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Community Messages</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Connect with other community members
            </p>
          </div>

          <div className="bg-card border rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Community Chat</h2>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={`${
                  user && message.userId === (user.id || "current-user") 
                    ? "ml-auto bg-primary/10" 
                    : "mr-auto"
                  } max-w-[85%]`}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{message.userName}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(message.timestamp)}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
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
