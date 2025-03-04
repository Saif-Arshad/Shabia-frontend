
import React, { useState, useEffect } from "react";
import { Search, ArrowRight, MapPin, Bell, CalendarDays, Briefcase } from "lucide-react";
import Button from "@/components/ui/Button";
import AnimatedIcon from "@/components/ui/AnimatedIcon";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Adding a slight delay to the animation for better visual effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20 min-h-screen flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute opacity-30 w-96 h-96 bg-blue-400 rounded-full blur-3xl -top-10 -left-16"></div>
        <div className="absolute opacity-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl -bottom-20 -right-16"></div>
      </div>

      <div className="section-container relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-700 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
              Connecting Abu Dhabi Communities
            </span>
          </div>
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Discover Your <span className="text-primary">Local Community</span>
          </h1>
          <p className="mb-10 text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Connect with local services, stay updated with community news, find events, and discover job opportunities in Abu Dhabi.
          </p>

          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 bg-white dark:bg-slate-800 border border-input rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="Search for local services, events, news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <Button
                  variant="accent"
                  size="sm"
                  className="inline-flex items-center rounded-lg px-4"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-4xl transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div className="glass-panel p-6 flex flex-col items-center text-center hover-card-effect">
            <AnimatedIcon
              icon={<MapPin className="h-6 w-6" />}
              animation="float"
              className="mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Local Services</h3>
            <p className="text-sm text-muted-foreground">
              Find nearby businesses and essential services
            </p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center hover-card-effect">
            <AnimatedIcon
              icon={<Bell className="h-6 w-6" />}
              animation="float"
              className="mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Community News</h3>
            <p className="text-sm text-muted-foreground">
              Stay updated with local announcements and news
            </p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center hover-card-effect">
            <AnimatedIcon
              icon={<CalendarDays className="h-6 w-6" />}
              animation="float"
              className="mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Events Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Discover upcoming community events and activities
            </p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center hover-card-effect">
            <AnimatedIcon
              icon={<Briefcase className="h-6 w-6" />}
              animation="float"
              className="mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Job Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              Find local job opportunities and career resources
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
