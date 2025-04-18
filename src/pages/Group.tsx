// src/pages/Group.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { toast } from 'sonner';

const API = import.meta.env.VITE_BACKEND_URL;

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

export default function Group() {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);

    const [form, setForm] = useState({
        name: '',
        location1: '',
        location2: '',
    });

    // load all groups
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API}/groups`);
            setGroups(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchGroups();
    }, [user]);

    // open the dialog for create
    const openCreate = () => {
        setIsEditing(false);
        setCurrentGroup(null);
        setForm({ name: '', location1: '', location2: '' });
        setIsDialogOpen(true);
    };

    // open for edit
    const openEdit = (g) => {
        setIsEditing(true);
        setCurrentGroup(g);
        setForm({
            name: g.name,
            location1: g.location1,
            location2: g.location2,
        });
        setIsDialogOpen(true);
    };

    // delete
    const handleDelete = async (id) => {
        if (!confirm('Delete this group?')) return;
        try {
            await axios.delete(`${API}/groups/${id}`);
            toast.success('Group deleted');
            fetchGroups();
        } catch {
            toast.error('Failed to delete');
        }
    };

    // on form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        try {
            if (isEditing) {
                await axios.put(`${API}/groups/${currentGroup.id}`, payload);
                toast.success('Group updated');
            } else {
                await axios.post(`${API}/groups`, payload);
                toast.success('Group created');
            }
            setIsDialogOpen(false);
            fetchGroups();
        } catch (err) {
            console.error(err);
            toast.error('Save failed');
        }
    };

    // keep city list in sync
    const cities = regions[form.location1] || [];

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-24 px-4">
                    <div className="max-w-md mx-auto text-center p-8 border rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                        <p className="text-muted-foreground mb-6">
                            You need to be logged in to view this page.
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
            <main className="flex-grow pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Manage Groups</h1>
                            <p className="text-muted-foreground">View and manage all groups</p>
                        </div>
                        <Button onClick={openCreate}>Add Group</Button>
                    </div>

                    {loading ? (
                        <div>Loading…</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Region
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            City
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {groups.map((g) => (
                                        <tr key={g.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{g.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{g.location1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{g.location2}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(g.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => openEdit(g)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(g.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            {/* Add / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit Group' : 'Add Group'}
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
                            <label className="block mb-1 font-medium">Region*</label>
                            <Select
                                value={form.location1}
                                onValueChange={val => setForm(f => ({ ...f, location1: val }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Region" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(regions).map(region => (
                                        <SelectItem key={region} value={region}>
                                            {region}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">City*</label>
                            <Select
                                value={form.location2}
                                onValueChange={val => setForm(f => ({ ...f, location2: val }))}
                                required
                                disabled={!form.location1}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select City" />
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
        </div>
    );
}
