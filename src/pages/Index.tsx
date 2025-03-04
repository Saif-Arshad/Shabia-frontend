
import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import NewsFeed from "@/components/home/NewsFeed";
import ServicesDirectory from "@/components/home/ServicesDirectory";
import EventsSection from "@/components/home/EventsSection";
import JobBoard from "@/components/home/JobBoard";

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* <ServicesDirectory />
        <NewsFeed />
        <EventsSection />
        <JobBoard /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Index;
