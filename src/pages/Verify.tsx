/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const Verify: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

    
        setIsLoading(true)
        const payload = {
            email,
            otp
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/verify`, payload)
            if (res.data) {
                toast({
                    title: "Successful",
                    description: "verify email Successful",
                });
                navigate(`/login`)
            }
        } catch (error: any) {
            toast({
                title: "Invalid OTP",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false)
        }

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 flex flex-col items-start">

                    <CardTitle className="text-2xl font-bold text-start">Verify Your Email</CardTitle>
                    <CardDescription className="text-start">
                        We've sent a verification code to your email
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Enter the 5-digit code below
                                </p>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="text-center text-lg tracking-widest"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    required
                                />
                            </div>



                            <Button
                                type="submit"
                                className="w-full bg-primary  mb-4"
                                disabled={isLoading }
                            >
                                {isLoading ? "Verifying..." : "Verify Account"}
                            </Button>


                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Verify;