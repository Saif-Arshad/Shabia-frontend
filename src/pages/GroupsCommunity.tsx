/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from '@/components/layout/Layout'
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function GroupsCommunity() {
    const [groups, setGroups] = useState([]);
    const API = import.meta.env.VITE_BACKEND_URL;
    const { user } = useAuth();
    const navigate = useNavigate()
    const fetchGroups = async () => {
        try {
            const { data } = await axios.get(`${API}/groups`);
            console.log("🚀 ~ fetchGroups ~ data:", data)
            setGroups(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch groups');
        }
    };

    const handleJoinLeave = async (groupId: number, action: 'join' | 'leave') => {
        if (!user) {
            toast.error('Please login to join or leave a group');
            return;
        }
        try {
            await axios.post(`${API}/groups/${groupId}/participant`, { userId: user?.id });
            toast.success(`Successfully ${action}ed the group`);
            fetchGroups();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${action} group`);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);
    const handleViewGroup = (group) => {

        if (!user) {
            toast.error('Please login to view group details');
            return;
        }
        if (group.GroupParticipant?.some((p: any) => p.userId === user?.id)) {
            navigate(`/community/${group.id}`);
        } else {
            toast.error('Please join the group to view details');
        }
    }
    return (
        <Layout>
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold mb-8">Community Groups</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group: any) => (
                        <div
                            key={group.id}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-semibold">{group.name}</h2>
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    {group.GroupParticipant?.length || 0} members
                                </span>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 mr-1 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {group.location1}, {group.location2}
                                </p>
                            </div>

                            <div className="flex gap-2 mb-6">
                                {group.GroupParticipant?.some((p: any) => p.userId === user?.id) ? (
                                    <button
                                        onClick={() => handleJoinLeave(group.id, 'leave')}
                                        className=" w-fit bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <LogOut className='h-4 w-4' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinLeave(group.id, 'join')}
                                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                        </svg>
                                        Join Group
                                    </button>
                                )}

                                <button
                                    onClick={() => handleViewGroup(group)}
                                    className="flex-1 bg-primary text-white px-4 py-2 rounded-full transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    View Group
                                </button>
                            </div>

                            <div className="flex items-center justify-end border-t pt-4">
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-9 w-9 text-gray-400 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">{group.admin.name}</p>
                                        <p className="text-xs text-gray-500">{group.admin.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </Layout>
    )
}

export default GroupsCommunity