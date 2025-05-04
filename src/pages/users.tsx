import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface User {
    id: number;
    email: string;
    name: string;
    Role: string;
    location: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

const Users = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [form, setForm] = useState({
        id: null,
        name: '',
        location: '',
        email: '',
        Role: '',
    });
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/all`);
            console.log("🚀 ~ fetchUsers ~ response:", response.data)
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`);
                toast.success("User deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };
    const openEdit = (g) => {
        setIsEditing(true);
        setForm({
            id: g.id,
            name: g.name,
            Role: g.Role,
            location: g.location,
            email: g.email,
        });
        setIsDialogOpen(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update/${form.id}`, form);
            toast.success('User updated');
            setIsDialogOpen(false);
            fetchUsers();


        } catch (error) {
            console.log("🚀 ~ handleSubmit ~ error:", error)

        }
    }
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Edit User
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Name*</label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email*</label>
                            <Input
                                value={form.email}
                                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Location*</label>
                            <Input
                                value={form.location}
                                onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">User Type*</label>
                            <Select
                                value={form.Role}
                                onValueChange={val => setForm(f => ({ ...f, Role: val }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select UserType" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"USER"}>
                                        USER
                                    </SelectItem>
                                    <SelectItem value={"MODERATOR"}>
                                        MODERATOR USER
                                    </SelectItem>
                                    <SelectItem value={"BUSINESS"}>
                                        BUSINESS USER
                                    </SelectItem>
                                    <SelectItem value={"ADMIN"}>
                                        ADMIN USER
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <main className="flex-grow pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Manage Users</h1>
                        <p className="text-muted-foreground">View and manage all users</p>
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.Role}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.location}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {user.isVerified ? "Yes" : "No"}
                                                    </td>
                                                    <td className="px-6 py-4 space-x-3 whitespace-nowrap text-sm">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openEdit(user)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Users;
