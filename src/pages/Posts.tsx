
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, Search, AlertCircle } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import NewsCard from "@/components/news/NewsCard";
import { Job } from "@/types/job";
import { News } from "@/types/news";
import { Event } from "@/types/event";
import NewsDetailDialog from "@/components/news/NewsDetailDialog";
import JobDetailDialog from "@/components/jobs/JobDetailDialog";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import EventCard from "@/components/events/EventCard";

type PostType = "news" | "events" | "jobs" | "services" | "community";

interface SearchParams {
  keyword: string;
  area: string;
  city: string;
}

const Posts = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    area: "",
    city: "",
  });
  const [areas, setAreas] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);
  
  // Dialog states
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Fetch areas and cities
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Normally we would fetch from API, but for now using mock data
        const mockAreas = ["New York", "California", "Texas", "Florida", "Illinois"];
        const mockCities = {
          "New York": ["New York City", "Buffalo", "Rochester"],
          "California": ["Los Angeles", "San Francisco", "San Diego"],
          "Texas": ["Houston", "Austin", "Dallas"],
          "Florida": ["Miami", "Orlando", "Tampa"],
          "Illinois": ["Chicago", "Springfield", "Peoria"]
        };
        
        setAreas(mockAreas);
        
        if (searchParams.area) {
          setCities(mockCities[searchParams.area as keyof typeof mockCities] || []);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch locations. Please try again later."
        });
      }
    };

    fetchLocations();
  }, [searchParams.area]);

  // Fetch posts from all categories
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Mocking API calls for now
        const responses = await Promise.all([
          fetch(`${API}/posts?type=news`).catch(() => ({ ok: false })),
          fetch(`${API}/posts?type=events`).catch(() => ({ ok: false })),
          fetch(`${API}/posts?type=jobs`).catch(() => ({ ok: false })),
          fetch(`${API}/posts?type=services`).catch(() => ({ ok: false })),
          fetch(`${API}/posts?type=community`).catch(() => ({ ok: false })),
        ]);

        // Create mock data since API might not be available
        const mockNews = Array(8).fill(null).map((_, i) => ({
          id: `news-${i}`,
          title: `News Article ${i + 1}`,
          description: `This is a sample news article description. It contains information about local events and community updates.`,
          image: `https://source.unsplash.com/random/300x200?news&sig=${i}`,
          category: ["Community", "Local", "Politics"][i % 3],
          location1: areas[i % areas.length] || "California",
          location2: "Sample City",
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          createdBy: "admin",
        }));

        const mockEvents = Array(8).fill(null).map((_, i) => ({
          id: `event-${i}`,
          title: `Community Event ${i + 1}`,
          description: `Join us for this exciting community event where people gather to celebrate and connect.`,
          image: `https://source.unsplash.com/random/300x200?event&sig=${i}`,
          category: ["Festival", "Workshop", "Meetup"][i % 3],
          location1: areas[i % areas.length] || "California",
          location2: "Event Venue",
          eventDate: new Date(Date.now() + i * 86400000).toISOString(),
          startTime: "10:00 AM",
          endTime: "2:00 PM",
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          createdBy: "admin",
        }));

        const mockJobs = Array(8).fill(null).map((_, i) => ({
          id: `job-${i}`,
          title: `${["Software Developer", "Marketing Specialist", "Project Manager"][i % 3]} Position`,
          description: `We are looking for a talented professional to join our growing team. This role offers competitive salary and benefits.`,
          image: `https://source.unsplash.com/random/300x200?work&sig=${i}`,
          company: ["TechCorp", "Marketing Agency", "Global Solutions"][i % 3],
          salary: `$${60 + i * 5}k - $${80 + i * 5}k`,
          location1: areas[i % areas.length] || "California",
          location2: "Downtown Area",
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          createdBy: "admin",
        }));

        const allPosts = [
          ...mockNews.map(item => ({ ...item, type: 'news' })),
          ...mockEvents.map(item => ({ ...item, type: 'events' })),
          ...mockJobs.map(item => ({ ...item, type: 'jobs' })),
        ];
        
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch posts. Please try again later."
        });
      }
    };

    fetchPosts();
  }, [API, areas]);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      const filtered = posts.filter(post => {
        const matchesKeyword = !searchParams.keyword || 
          post.title.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          post.description.toLowerCase().includes(searchParams.keyword.toLowerCase());
        
        const matchesArea = !searchParams.area || 
          post.location1.toLowerCase() === searchParams.area.toLowerCase();
        
        const matchesCity = !searchParams.city || 
          (post.location2 && post.location2.toLowerCase() === searchParams.city.toLowerCase());
        
        return matchesKeyword && matchesArea && matchesCity;
      });

      setFilteredPosts(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const handlePostTypeFilter = (type: PostType) => {
    setSelectedPostType(type === selectedPostType ? null : type);
    
    const filtered = type === selectedPostType
      ? posts // If deselecting, show all posts
      : posts.filter(post => post.type === type);
    
    setFilteredPosts(filtered);
  };

  const handleInputChange = (key: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
    
    // Reset city when area changes
    if (key === 'area') {
      setSearchParams(prev => ({ ...prev, city: "" }));
    }
  };

  const handleViewNews = (news: News) => {
    setSelectedNews(news);
    setIsNewsDialogOpen(true);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsJobDialogOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  // Render post card based on type
  const renderPostCard = (post: any) => {
    switch (post.type) {
      case 'news':
        return (
          <div key={post.id} className="h-full">
            <NewsCard 
              news={post} 
              onView={() => handleViewNews(post)} 
            />
          </div>
        );
      case 'events':
        return (
          <div key={post.id} className="h-full">
            <EventCard 
              event={post} 
              onView={() => handleViewEvent(post)} 
            />
          </div>
        );
      case 'jobs':
        return (
          <div key={post.id} className="h-full">
            <JobCard 
              job={post} 
              onView={() => handleViewJob(post)} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Search Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Discover Posts in Your Community
          </h1>
          <p className="text-muted-foreground text-lg mb-8 text-center max-w-2xl mx-auto">
            Find the latest news, events, jobs, services and community updates tailored to your location.
          </p>
          
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Keyword
                  </label>
                  <Input 
                    placeholder="Search by title or description" 
                    value={searchParams.keyword}
                    onChange={(e) => handleInputChange('keyword', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Area
                  </label>
                  <Select 
                    value={searchParams.area} 
                    onValueChange={(value) => handleInputChange('area', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    City
                  </label>
                  <Select 
                    value={searchParams.city} 
                    onValueChange={(value) => handleInputChange('city', value)}
                    disabled={!searchParams.area}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!searchParams.area ? "Select an area first" : "Select a city"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="mt-6 w-full md:w-auto md:px-8" 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Posts
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Post Type Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button 
            variant={selectedPostType === 'news' ? 'default' : 'outline'} 
            onClick={() => handlePostTypeFilter('news')}
          >
            News
          </Button>
          <Button 
            variant={selectedPostType === 'events' ? 'default' : 'outline'} 
            onClick={() => handlePostTypeFilter('events')}
          >
            Events
          </Button>
          <Button 
            variant={selectedPostType === 'jobs' ? 'default' : 'outline'} 
            onClick={() => handlePostTypeFilter('jobs')}
          >
            Jobs
          </Button>
          <Button 
            variant={selectedPostType === 'services' ? 'default' : 'outline'} 
            onClick={() => handlePostTypeFilter('services')}
          >
            Services
          </Button>
          <Button 
            variant={selectedPostType === 'community' ? 'default' : 'outline'} 
            onClick={() => handlePostTypeFilter('community')}
          >
            Community
          </Button>
        </div>
        
        {/* Search Results */}
        {hasSearched && isSearching && (
          <div className="flex justify-center py-16">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <span className="sr-only">Loading search results</span>
          </div>
        )}
        
        {hasSearched && !isSearching && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
            <p className="text-muted-foreground">
              No posts are available in the selected area and city. Try broadening your search criteria.
            </p>
          </div>
        )}
        
        {/* Posts Grid */}
        {(!hasSearched || (filteredPosts.length > 0 && !isSearching)) && (
          <>
            <h2 className="text-2xl font-bold mb-6">
              {selectedPostType 
                ? `${selectedPostType.charAt(0).toUpperCase() + selectedPostType.slice(1)} Posts`
                : 'All Posts'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map(post => renderPostCard(post))}
            </div>
          </>
        )}
        
        {/* Detail Dialogs */}
        <NewsDetailDialog
          isOpen={isNewsDialogOpen}
          onClose={() => setIsNewsDialogOpen(false)}
          news={selectedNews}
        />
        
        <JobDetailDialog
          isOpen={isJobDialogOpen}
          onClose={() => setIsJobDialogOpen(false)}
          job={selectedJob}
        />
        
        <EventDetailDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          event={selectedEvent}
        />
      </div>
    </Layout>
  );
};

export default Posts;
