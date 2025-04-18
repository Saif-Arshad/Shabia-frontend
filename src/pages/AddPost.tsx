// src/pages/AddPost.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import useAuth from "@/hooks/useAuth";
import uploadToCloudinary from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const regions = {
  "Abu Dhabi Region": [
    "Abu Dhabi City", "Khalifa City", "Mohammed Bin Zayed City", "Shakhbout City",
    "Al Shahama", "Al Bahia", "Mussafah", "Al Wathba", "Bawabat Al Sharq",
    "Yas Island", "Saadiyat Island", "Reem Island"
  ],
  "Al Ain Region": [
    "Al Yahar", "Al Hili", "Al Muwaiji", "Al Jimi", "Zakhir", "Al Faqa",
    "Sweihan", "Al Hayer", "Shwaib"
  ],
  "Al Dhafra Region": [
    "Madinat Zayed", "Liwa", "Al Silaa’", "Ghayathi", "Delma Island", "Ruwais", "Al Mirfa"
  ],
};

const postTypes = [
  { id: "NEWS", label: "News Article" },
  { id: "EVENT", label: "Event" },
  { id: "JOB", label: "Job Posting" },
  { id: "SERVICE", label: "Service" },
];

const AddPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isEditing = Boolean(id);

  const [selectedType, setSelectedType] = useState("NEWS");
  const [cities, setCities] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location1: "",
    location2: "",
    image: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    jobType: "Full-time",
    company: "",
    salary: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetch(`${BACKEND_URL}/posts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load post");
          return res.json();
        })
        .then((data) => {
          console.log("🚀 ~ .then ~ data:", data)
          const p = data.post;
          setSelectedType(p.type);
          setForm({
            title: p.title || "",
            category: p.category || "",
            description: p.description || "",
            location1: p.location1 || "",
            location2: p.location2 || "",
            image: p.image || "",
            eventDate: p.eventDate || "",
            startTime: p.startTime || "",
            endTime: p.endTime || "",
            jobType: p.jobType || "Full-time",
            company: p.company || "",
            salary: p.salary || "",
            contactEmail: p.contactEmail || user?.email,
            contactPhone: p.contactPhone || "",
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Could not load post");
        });
    }
  }, [id, isEditing, user?.email]);

  useEffect(() => {
    setCities(regions[form.location1] || []);
    if (!regions[form.location1]?.includes(form.location2)) {
      setForm((f) => ({ ...f, location2: "" }));
    }
  }, [form.location1]);

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      if (result.URL) {
        setForm((f) => ({ ...f, image: result.URL }));
        toast.success("Image uploaded");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.location1) {
      toast.error("Region is required");
      return;
    }
    if (!form.location2) {
      toast.error("City is required");
      return;
    }

    if (selectedType === "EVENT") {
      if (!form.eventDate) {
        toast.error("Event date is required");
        return;
      }
      if (!form.startTime) {
        toast.error("Start time is required");
        return;
      }
      if (!form.endTime) {
        toast.error("End time is required");
        return;
      }
    }

    if (selectedType === "JOB") {
      if (!form.company.trim()) {
        toast.error("Company name is required");
        return;
      }
      if (!form.salary.trim()) {
        toast.error("Salary is required");
        return;
      }
      if (!form.contactEmail.trim()) {
        toast.error("Contact email is required");
        return;
      }
    }

    if (selectedType === "SERVICE" && !form.contactEmail.trim()) {
      toast.error("Contact email is required");
      return;
    }

    e.preventDefault();
    const payload = { ...form, type: selectedType, createdBy: user.id };
    try {
      const res = await fetch(
        isEditing ? `${BACKEND_URL}/posts/${id}` : `${BACKEND_URL}/posts`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      toast.success(isEditing ? "Post updated" : "Post created");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Error saving");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to create or edit posts.
            </p>
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
      <main className="flex-grow pt-24 px-4 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEditing
              ? `Edit ${selectedType.toLowerCase()}`
              : `Create ${selectedType.toLowerCase()}`}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modify the fields and submit to update this post."
              : "Select a type below, fill the form, and submit to create."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {postTypes.map((t) => (
            <Button
              key={t.id}
              variant={selectedType === t.id ? "secondary" : "outline"}
              onClick={() => {

                setSelectedType(t.id)
                setForm({
                  title: "",
                  category: "",
                  description: "",
                  location1: "",
                  location2: "",
                  image: "",
                  eventDate: "",
                  startTime: "",
                  endTime: "",
                  jobType: "Full-time",
                  company: "",
                  salary: "",
                  contactEmail: user?.email || "",
                  contactPhone: "",
                })
              }
              }
              className="w-full"
            >
              {t.label}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title*</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Category*</label>
            <Input
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description*</label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              rows={4}
            />
          </div>

          {/* Region & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Region*</label>
              <Select
                value={form.location1}
                onValueChange={(v) => handleChange("location1", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(regions).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">City*</label>
              <Select
                value={form.location2}
                onValueChange={(v) => handleChange("location2", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 font-medium">Image</label>
            <Input type="file" onChange={handleFile} disabled={imageUploading} />
            {imageUploading && <p>Uploading…</p>}
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover w-full" />
            )}
          </div>

          {/* Type‑specific fields */}
          {selectedType === "EVENT" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Event Date*</label>
                <Input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => handleChange("eventDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Start Time*</label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Time*</label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {selectedType === "JOB" && (
            <>
              <div>
                <label className="block mb-1 font-medium">Company*</label>
                <Input
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Job Type*</label>
                  <Select
                    value={form.jobType}
                    onValueChange={(v) => handleChange("jobType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Full-time",
                        "Part-time",
                        "Contract",
                        "Internship",
                        "Freelance",
                      ].map((jt) => (
                        <SelectItem key={jt} value={jt}>
                          {jt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Salary*</label>
                  <Input
                    value={form.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Contact Email*</label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Contact Phone</label>
                  <Input
                    value={form.contactPhone}
                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {selectedType === "SERVICE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Contact Email*</label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Contact Phone</label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)} disabled={imageUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={imageUploading}>
              {isEditing ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AddPost;
