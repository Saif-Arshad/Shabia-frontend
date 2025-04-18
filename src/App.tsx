import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LocalServices from "./pages/LocalServices";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import NewsManagement from "./pages/NewsManagement";
import NewsList from "./pages/NewsList";
import EventsManagement from "./pages/EventsManagement";
import EventsList from "./pages/EventsList";
import JobsManagement from "./pages/JobsManagement";
import PostsManagement from "./pages/PostsManagement";
import JobsList from "./pages/JobsList";
import Community from "./pages/Community";
import Verify from "./pages/Verify";
import AddPost from "./pages/AddPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/local-services" element={<LocalServices />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/services" element={<Services />} />
          <Route path="/dashboard/add-post" element={<AddPost />} />
          <Route path="/dashboard/news" element={<NewsManagement />} />
          <Route path="/dashboard/events" element={<EventsManagement />} />
          <Route path="/dashboard/jobs" element={<JobsManagement />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/community" element={<Community />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
