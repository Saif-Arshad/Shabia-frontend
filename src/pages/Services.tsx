import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import uploadToCloudinary from "@/lib/upload";

const Services = () => {
  const { user } = useAuth();
  console.log("🚀 ~ Services ~ user:", user)
  const [services, setServices] = useState([]);

  const [currentService, setCurrentService] = useState({
    id: 0,
    title: "",
    category: "",
    description: "",
    location: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    image: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const [loadingServices, setLoadingServices] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    console.log(user)
    if(user?.id){
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/service/${user.id}`);
    console.log(response.data)
      if (response.data.service) {
        setServices(response.data.service);
      } else {
        setServices([]);
      }
    } catch (err) {
      toast.error("Error fetching services");
      console.error(err);
    }
    setLoadingServices(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true);
      const result = await uploadToCloudinary(file);
      if (result.URL) {
        setCurrentService(prev => ({ ...prev, image: result.URL }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
      setImageUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!currentService.title || !currentService.category || !currentService.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      setUpdating(true);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/service/services/${currentService.id}`,
          currentService
        );
        const updatedService = response.data.service;
        setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
        toast.success("Service updated successfully");
      } catch (error) {
        toast.error("Error updating service");
        console.error(error);
      }
      setUpdating(false);
    } else {
      setCreating(true);
      try {
        const payload = { ...currentService, createdBy: user.id };
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/service/`, payload);
        const newService = response.data.service;
        setServices([...services, newService]);
        toast.success("Service added successfully");
      } catch (error) {
        toast.error("Error adding service");
        console.error(error);
      }
      setCreating(false);
    }
    resetForm();
  };

  const handleDelete = async () => {
    if (serviceToDelete) {
      setDeleting(true);
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/service/services/${serviceToDelete}`);
        setServices(services.filter(service => service.id !== serviceToDelete));
        toast.success("Service deleted successfully");
      } catch (error) {
        toast.error("Error deleting service");
        console.error(error);
      }
      setDeleting(false);
      setServiceToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  // Populate form for editing a service
  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  // Reset the form to its default values
  const resetForm = () => {
    setCurrentService({
      id: 0,
      title: "",
      category: "",
      description: "",
      location: "",
      contactEmail: user?.email || "",
      contactPhone: "",
      image: ""
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view this page.</p>
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
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Your Services</h1>
              <p className="text-muted-foreground">Manage your service listings</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={18} />
                  {isEditing ? "Edit Service" : "Add New Service"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleFormSubmit}>
                  <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Service" : "Add New Service"}</DialogTitle>
                    <DialogDescription>
                      {isEditing
                        ? "Update your service information below"
                        : "Enter the details for your new service"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Service Title
                      </label>
                      <Input
                        id="title"
                        value={currentService.title}
                        onChange={(e) =>
                          setCurrentService({ ...currentService, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Input
                        id="category"
                        value={currentService.category}
                        onChange={(e) =>
                          setCurrentService({ ...currentService, category: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        value={currentService.location}
                        onChange={(e) =>
                          setCurrentService({ ...currentService, location: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={currentService.description}
                        onChange={(e) =>
                          setCurrentService({ ...currentService, description: e.target.value })
                        }
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Contact Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={currentService.contactEmail}
                          onChange={(e) =>
                            setCurrentService({ ...currentService, contactEmail: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Contact Phone
                        </label>
                        <Input
                          id="phone"
                          value={currentService.contactPhone}
                          onChange={(e) =>
                            setCurrentService({ ...currentService, contactPhone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="image" className="text-sm font-medium">
                        Image
                      </label>
                      <Input
                        id="image"
                        type="file"
                        onChange={handleFileChange}
                      />
                      {imageUploading && <p>Uploading image...</p>}
                      {currentService.image && !imageUploading && (
                        <img src={currentService.image} alt="Service" className="mt-2 h-40 object-cover" />
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={creating || updating || imageUploading}
                    >
                      {(creating || updating)
                        ? "Saving..."
                        : isEditing
                          ? "Save Changes"
                          : "Add Service"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loadingServices ? (
            <p>Loading services...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? (
                services.map((service) => (
                  <Card key={service.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-video w-full overflow-hidden">
                      {service.image && (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-2">{service.title}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Badge variant="outline" className="mr-2">
                              {service.category}
                            </Badge>
                            {service.location}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {service.description}
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto border-t pt-4">
                      <div className="flex justify-between items-center w-full">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setServiceToDelete(service.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={deleting}
                        >
                          <Trash2 size={16} className="mr-2" />
                          {deleting ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground mb-4">You haven't added any services yet.</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Your First Service</Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your service.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
