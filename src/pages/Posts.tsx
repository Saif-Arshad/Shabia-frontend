/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Search, AlertCircle } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import NewsCard from "@/components/news/NewsCard";
import EventCard from "@/components/events/EventCard";
import NewsDetailDialog from "@/components/news/NewsDetailDialog";
import JobDetailDialog from "@/components/jobs/JobDetailDialog";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { Job } from "@/types/job";
import { News } from "@/types/news";
import { Event } from "@/types/event";

type PostType = "NEWS" | "EVENT" | "JOB" | "SERVICE";

interface SearchParams {
  keyword: string;
  region: string;
  city: string;
}

const Posts = () => {
  const { toast } = useToast();

  /* ───────────────────────────── state ───────────────────────────── */
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    region: "",
    city: "",
  });
  const [cities, setCities] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(
    null,
  );

  /* dialogs */
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* hard‑coded UAE regions & cities */
  const regions: Record<string, string[]> = {
    "Abu Dhabi Region": [
      "Abu Dhabi City",
      "Khalifa City",
      "Mohammed Bin Zayed City",
      "Shakhbout City",
      "Al Shahama",
      "Al Bahia",
      "Mussafah",
      "Al Wathba",
      "Bawabat Al Sharq",
      "Yas Island",
      "Saadiyat Island",
      "Reem Island",
    ],
    "Al Ain Region": [
      "Al Yahar",
      "Al Hili",
      "Al Muwaiji",
      "Al Jimi",
      "Zakhir",
      "Al Faqa",
      "Sweihan",
      "Al Hayer",
      "Shwaib",
    ],
    "Al Dhafra Region": [
      "Madinat Zayed",
      "Liwa",
      "Al Silaa'",
      "Ghayathi",
      "Delma Island",
      "Ruwais",
      "Al Mirfa",
    ],
  };

  useEffect(() => {
    if (searchParams.region) {
      setCities(regions[searchParams.region] || []);
    } else {
      setCities([]);
    }
  }, [searchParams.region]);

  /* fetch posts once on mount */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
          }/posts/`,
        );

        const formattedPosts = (data.posts || []).map((p: any) => ({
          ...p,
          type: String(p.type).toUpperCase(),
        }));

        setPosts(formattedPosts);
        setFilteredPosts(formattedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch posts. Please try again later.",
        });
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  /* ────────────────────────── handlers ────────────────────────── */

  const handleInputChange = (key: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    // reset city when region changes
    if (key === "region") {
      setSearchParams((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      const filtered = posts.filter((post) => {
        const matchesKeyword =
          !searchParams.keyword ||
          post.title?.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          post.description
            ?.toLowerCase()
            .includes(searchParams.keyword.toLowerCase());

        const matchesRegion =
          !searchParams.region ||
          post.location1?.toLowerCase() === searchParams.region.toLowerCase();

        const matchesCity =
          !searchParams.city ||
          post.location2?.toLowerCase() === searchParams.city.toLowerCase();

        return matchesKeyword && matchesRegion && matchesCity;
      });

      setFilteredPosts(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const handlePostTypeFilter = (type: PostType) => {
    // toggle selection
    const newSelected = type === selectedPostType ? null : type;
    setSelectedPostType(newSelected);

    setFilteredPosts(
      newSelected ? posts.filter((p) => p.type === newSelected) : posts,
    );
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

  const renderPostCard = (post: any) => {
    switch (post.type as PostType) {
      case "NEWS":
        return (
          <div key={post.id} className="h-full">
            <NewsCard news={post} onViewDetails={() => handleViewNews(post)} />
          </div>
        );
      case "EVENT":
        return (
          <div key={post.id} className="h-full">
            <EventCard event={post} onView={() => handleViewEvent(post)} />
          </div>
        );
      case "JOB":
        return (
          <div key={post.id} className="h-full">
            <JobCard job={post} onView={() => handleViewJob(post)} />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero / search bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Discover Posts in Your Community
          </h1>
          <p className="text-muted-foreground text-lg mb-8 text-center max-w-2xl mx-auto">
            Find the latest news, events, jobs and service updates tailored to
            your location.
          </p>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* keyword */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Keyword
                  </label>
                  <Input
                    placeholder="Search by title or description"
                    value={searchParams.keyword}
                    onChange={(e) =>
                      handleInputChange("keyword", e.target.value)
                    }
                  />
                </div>

                {/* region */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Region
                  </label>
                  <Select
                    value={searchParams.region}
                    onValueChange={(v) => handleInputChange("region", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(regions).map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* city */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    City
                  </label>
                  <Select
                    value={searchParams.city}
                    onValueChange={(v) => handleInputChange("city", v)}
                    disabled={!searchParams.region}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !searchParams.region
                            ? "Select a region first"
                            : "Select a city"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* search button */}
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

        {/* filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(["NEWS", "EVENT", "JOB", "SERVICE"] as PostType[]).map((t) => (
            <Button
              key={t}
              variant={selectedPostType === t ? "default" : "outline"}
              onClick={() => handlePostTypeFilter(t)}
            >
              {t === "JOB" ? "Jobs" : t[0] + t.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        {/* loading states */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <span className="sr-only">Loading posts</span>
          </div>
        )}
        {hasSearched && isSearching && (
          <div className="flex justify-center py-16">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <span className="sr-only">Loading search results</span>
          </div>
        )}

        {/* empty state */}
        {!isLoading &&
          hasSearched &&
          !isSearching &&
          filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
              <p className="text-muted-foreground">
                No posts match your criteria. Try broadening your search.
              </p>
            </div>
          )}

        {/* posts grid */}
        {!isLoading &&
          (!hasSearched || (filteredPosts.length > 0 && !isSearching)) && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                {selectedPostType
                  ? `${selectedPostType.charAt(0)}${selectedPostType
                    .slice(1)
                    .toLowerCase()} Posts`
                  : "All Posts"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPosts.map((post) => renderPostCard(post))}
              </div>
            </>
          )}

        {/* detail dialogs */}
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
