'use client'

import { useState, useMemo } from 'react'
import { ThreeDCard } from '@/components/ui/3d-card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Loader2, Search, SlidersHorizontal, FileDown, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { cn } from '@/lib/utils'

type FlaggedTrade = {
    client_id: string;
    reason: string;
    stock_symbol: string;
    trade_id?: string;
}

const mockData: FlaggedTrade[] = [
    { client_id: 'CL1040', reason: 'Large Trade Value', stock_symbol: 'RELIANCE', trade_id: 'TRD13693' },
    { client_id: 'CL1024', reason: 'Large Trade Value', stock_symbol: 'RELIANCE', trade_id: 'TRD14069' },
    { client_id: 'CL1003', reason: 'Large Trade Value', stock_symbol: 'RELIANCE', trade_id: 'TRD11875' },
    { client_id: 'CL1010', reason: 'Large Trade Value', stock_symbol: 'BAJFINANCE', trade_id: 'TRD13498' },
    { client_id: 'CL1049', reason: 'Large Trade Value', stock_symbol: 'SBIN', trade_id: 'TRD13590' },
    { client_id: 'CL1005', reason: 'Large Trade Value', stock_symbol: 'RELIANCE', trade_id: 'TRD14010' },
    { client_id: 'CL1022', reason: 'Large Trade Value', stock_symbol: 'HDFCBANK', trade_id: 'TRD13140' },
    { client_id: 'CL1027', reason: 'Large Trade Value', stock_symbol: 'HDFCBANK', trade_id: 'TRD10983' },
    { client_id: 'CL1022', reason: 'Large Trade Value', stock_symbol: 'BAJFINANCE', trade_id: 'TRD10235' },
    { client_id: 'CL1003', reason: 'Potential Loss Booking', stock_symbol: 'INFY' },
    { client_id: 'CL1038', reason: 'Potential Loss Booking', stock_symbol: 'RELIANCE' },
    { client_id: 'CL1032', reason: 'Large Trade Value', stock_symbol: 'RELIANCE', trade_id: 'TRD13420' },
];

export function TradeWatchdogTable() {
    const [isLoading, setIsLoading] = useState(false);
    const [flaggedTrades, setFlaggedTrades] = useState<FlaggedTrade[]>([]);
    const [clientFilter, setClientFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');

    const handleRunCheck = async () => {
        setIsLoading(true);
        // In a real app, you'd fetch from http://127.0.0.1:5000/api/surveillance/run-check
        await new Promise(res => setTimeout(res, 1500));
        // Using mock data for demonstration
        setFlaggedTrades(mockData); 
        setIsLoading(false);
    }

    const filteredData = useMemo(() => {
        return flaggedTrades.filter(trade => {
            return (
                trade.client_id.toLowerCase().includes(clientFilter.toLowerCase()) &&
                trade.stock_symbol.toLowerCase().includes(stockFilter.toLowerCase()) &&
                (reasonFilter === 'all' || trade.reason === reasonFilter)
            )
        })
    }, [flaggedTrades, clientFilter, stockFilter, reasonFilter]);

    const reasons = useMemo(() => {
        const allReasons = flaggedTrades.map(trade => trade.reason);
        return ['all', ...Array.from(new Set(allReasons))];
    }, [flaggedTrades]);

    if(isLoading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
    }
    
    if (flaggedTrades.length === 0) {
        return (
            <div className="text-center py-20">
                <Button size="lg" onClick={handleRunCheck} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                    Run Surveillance Check
                </Button>
                <p className="text-muted-foreground mt-4 text-sm">Click to scan for potentially suspicious trading activities.</p>
            </div>
        )
    }

    return (
        <ThreeDCard>
            <Card className="border-0 shadow-none bg-transparent">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-lg font-headline">
                            <SlidersHorizontal className="h-5 w-5"/>
                            <span>Flagged Trades</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                             <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Filter by Client..." className="pl-8 w-full md:w-[150px]" value={clientFilter} onChange={e => setClientFilter(e.target.value)} />
                            </div>
                             <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Filter by Stock..." className="pl-8 w-full md:w-[150px]" value={stockFilter} onChange={e => setStockFilter(e.target.value)} />
                            </div>
                            <Select value={reasonFilter} onValueChange={setReasonFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filter by Reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reasons.map(reason => (
                                        <SelectItem key={reason} value={reason}>{reason === 'all' ? 'All Reasons' : reason}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client ID</TableHead>
                                <TableHead>Stock Symbol</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Trade ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((trade, index) => (
                                <TableRow key={index} className="bg-destructive/10 hover:bg-destructive/20">
                                    <TableCell className="font-medium">{trade.client_id}</TableCell>
                                    <TableCell>{trade.stock_symbol}</TableCell>
                                    <TableCell>
                                         <Badge variant='destructive' className="whitespace-nowrap">{trade.reason}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">{trade.trade_id || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </ThreeDCard>
    )
}
