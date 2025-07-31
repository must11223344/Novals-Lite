
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Users, BookOpen, Coins, Banknote, Code } from 'lucide-react';

const mockWithdrawals = [
    { id: 'W1234', user: 'Alex Doe', amount: 1000, date: '2024-07-28', method: 'UPI', details: 'alex@upi' },
    { id: 'W1235', user: 'Jane Smith', amount: 2500, date: '2024-07-27', method: 'Bank', details: 'AC: ...4567' },
];

const mockUsers = [
    { id: '1', name: 'Alex Doe', email: 'mustakeem011220@gmail.com', coins: 1250 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', coins: 5300 },
];

export function AdminPanel() {
    const { toast } = useToast();
    const [adCode, setAdCode] = useState('');
    
    useEffect(() => {
        const savedAdCode = localStorage.getItem('ad_code');
        if (savedAdCode) {
            setAdCode(savedAdCode);
        }
    }, []);

    const handleSaveAdCode = () => {
        localStorage.setItem('ad_code', adCode);
        toast({
            title: 'Ad Code Saved',
            description: 'The ad code has been updated and will be displayed on the homepage.',
        });
    };

    return (
        <div className="container max-w-7xl py-8">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tighter flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Admin Panel
                </h1>
                <p className="text-muted-foreground mt-2">Manage users, stories, withdrawals, and settings.</p>
            </div>

            <Tabs defaultValue="dashboard">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                    <TabsTrigger value="ads">Ad Management</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="mt-6">
                   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">542</div>
                                <p className="text-xs text-muted-foreground">+50 since last week</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Coins Issued</CardTitle>
                                <Coins className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,250,000</div>
                                <p className="text-xs text-muted-foreground">Total coins in circulation</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
                                <Banknote className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2</div>
                                <p className="text-xs text-muted-foreground">Awaiting approval</p>
                            </CardContent>
                        </Card>
                   </div>
                </TabsContent>

                <TabsContent value="users" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View, search, and manage user accounts and coin balances.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Coins</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockUsers.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium">{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>{u.coins.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="withdrawals" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal Requests</CardTitle>
                            <CardDescription>Approve or reject pending withdrawal requests from users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Request ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockWithdrawals.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{item.user}</TableCell>
                                        <TableCell>{item.amount.toLocaleString()} Coins</TableCell>
                                        <TableCell><Badge variant="secondary">{item.method}</Badge></TableCell>
                                        <TableCell className="font-mono text-xs">{item.details}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700">Approve</Button>
                                            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700">Reject</Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="ads" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Code /> Ad Management</CardTitle>
                            <CardDescription>Paste your ad code here. It will be displayed in the ad placeholder on the homepage.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                                <Label htmlFor="ad-code">Ad Code (HTML/JavaScript)</Label>
                                <Textarea 
                                    id="ad-code" 
                                    className="min-h-[200px] font-mono text-sm" 
                                    placeholder="<-- Paste your ad code here -->"
                                    value={adCode}
                                    onChange={(e) => setAdCode(e.target.value)}
                                />
                           </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveAdCode}>Save Ad Code</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
