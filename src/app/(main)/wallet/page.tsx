
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Landmark, Smartphone, History, Banknote } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const withdrawalHistory = [
    { id: 'W1234', date: '2024-05-20', amount: 1000, status: 'Paid' },
    { id: 'W1235', date: '2024-05-15', amount: 1500, status: 'Paid' },
    { id: 'W1236', date: '2024-05-10', amount: 2000, status: 'Paid' },
];


export default function WalletPage() {
    const { toast } = useToast();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [coins, setCoins] = useState(250);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleWithdrawal = () => {
        const withdrawalAmount = parseInt(amount, 10);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a valid amount to withdraw.',
            });
            return;
        }

        if (coins < 1000) {
            toast({
                variant: 'destructive',
                title: 'Insufficient Balance',
                description: 'You need at least 1000 coins to make a withdrawal.',
            });
            return;
        }
        
        if (withdrawalAmount < 1000) {
             toast({
                variant: 'destructive',
                title: 'Minimum Withdrawal',
                description: 'The minimum withdrawal amount is 1000 coins.',
            });
            return;
        }

        if (withdrawalAmount > coins) {
            toast({
                variant: 'destructive',
                title: 'Amount Exceeds Balance',
                description: 'You cannot withdraw more coins than you have.',
            });
            return;
        }

        toast({
            title: 'Request Submitted!',
            description: `Your withdrawal request for ${withdrawalAmount} coins has been submitted for approval.`,
        });
        setAmount('');
    };

    if (loading || !user) {
        return <div className="container max-w-4xl py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container max-w-4xl py-12">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                             <CardTitle className="font-headline text-3xl flex items-center gap-2"><Wallet /> My Wallet</CardTitle>
                            <CardDescription>View your balance, withdraw coins, and see your transaction history.</CardDescription>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-muted-foreground">Total Balance</p>
                             <p className="text-3xl font-bold font-headline text-primary flex items-center gap-2 justify-end">
                                <Banknote className="h-8 w-8"/> {coins.toLocaleString()} Coins
                             </p>
                             <p className="text-sm text-muted-foreground">= ₹{(coins / 100).toFixed(2)}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="withdraw">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="withdraw" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Request Withdrawal</CardTitle>
                                    <CardDescription>Minimum withdrawal is 1000 coins (₹10). Your request will be sent for admin approval.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (in Coins)</Label>
                                        <Input id="amount" type="number" placeholder="e.g., 1000" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                    </div>
                                    <Tabs defaultValue="upi" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="upi"><Smartphone className="mr-2"/>UPI</TabsTrigger>
                                            <TabsTrigger value="bank"><Landmark className="mr-2"/>Bank</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="upi" className="pt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="upi-id">UPI ID</Label>
                                                <Input id="upi-id" placeholder="yourname@bank" />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="bank" className="pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="acc-name">Account Holder Name</Label>
                                                <Input id="acc-name" placeholder="John Doe" />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="acc-number">Account Number</Label>
                                                <Input id="acc-number" placeholder="1234567890" />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="ifsc">IFSC Code</Label>
                                                <Input id="ifsc" placeholder="ABCD0123456" />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full font-bold" onClick={handleWithdrawal}>Submit Request</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><History /> Withdrawal History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Request ID</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {withdrawalHistory.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.id}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>{item.amount.toLocaleString()} Coins</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={item.status === 'Paid' ? 'default' : 'secondary'} className={item.status === 'Paid' ? 'bg-green-500/80' : ''}>{item.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
