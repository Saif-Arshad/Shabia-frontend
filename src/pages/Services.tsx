
import React, { useState } from "react";
import { Link } from "react-router-dom";
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

// Mock service data - in a real app this would come from an API or database
const mockServices = [
  {
    id: 1,
    title: "Professional Plumbing Services",
    category: "Plumbing",
    description: "Expert plumbing services for residential and commercial properties. Available 24/7 for emergencies.",
    location: "Abu Dhabi City",
    contactEmail: "plumber@example.com",
    contactPhone: "+971 12 345 6789",
    image: "https://placehold.co/600x400/png"
  },
  {
    id: 2,
    title: "Electrical Maintenance",
    category: "Electrical",
    description: "Licensed electrician providing installation, repair, and maintenance services for all your electrical needs.",
    location: "Dubai",
    contactEmail: "electrician@example.com",
    contactPhone: "+971 98 765 4321",
    image: "https://placehold.co/600x400/png"
  }
];

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState(mockServices);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  
  // Form state for adding/editing service
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

  // Handle form submission for adding/editing service
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing service
      setServices(services.map(service => 
        service.id === currentService.id ? currentService : service
      ));
      toast.success("Service updated successfully");
    } else {
      // Add new service
      const newService = {
        ...currentService,
        id: Date.now() // Simple ID generation for demo
      };
      setServices([...services, newService]);
      toast.success("Service added successfully");
    }
    
    // Reset form
    resetForm();
  };

  // Delete a service
  const handleDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter(service => service.id !== serviceToDelete));
      setServiceToDelete(null);
      toast.success("Service deleted successfully");
    }
    setIsDeleteDialogOpen(false);
  };

  // Edit a service
  const handleEdit = (service: any) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  // Reset form state
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
                  Add New Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
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
                        onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
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
                        onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
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
                        onChange={(e) => setCurrentService({...currentService, location: e.target.value})}
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
                        onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
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
                          onChange={(e) => setCurrentService({...currentService, contactEmail: e.target.value})}
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
                          onChange={(e) => setCurrentService({...currentService, contactPhone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="image" className="text-sm font-medium">
                        Image URL (optional)
                      </label>
                      <Input 
                        id="image" 
                        value={currentService.image}
                        onChange={(e) => setCurrentService({...currentService, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {isEditing ? "Save Changes" : "Add Service"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
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
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 border rounded-lg">
                <p className="text-muted-foreground mb-4">You haven't added any services yet</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Your First Service</Button>
                  </DialogTrigger>
                  {/* Add Service Dialog Content - same as above */}
                </Dialog>
              </div>
            )}
          </div>
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
              <AlertDialogAction onClick={handleDelete}>
                Delete
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
