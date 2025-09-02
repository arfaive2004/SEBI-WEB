'use client'

import { useState, useMemo } from 'react'
import { ThreeDCard } from '@/components/ui/3d-card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Loader2, Search, SlidersHorizontal, FileDown } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { cn } from '@/lib/utils'

type MarginRecord = {
  client_id: string
  stock: string
  trade_type: 'BUY' | 'SELL'
  margin_required: number
  margin_available: number
  margin_status: 'OK' | 'issue'
}

const mockData: MarginRecord[] = [
    { client_id: 'CL1001', stock: 'RELIANCE', trade_type: 'BUY', margin_required: 50000, margin_available: 60000, margin_status: 'OK' },
    { client_id: 'CL1002', stock: 'TCS', trade_type: 'SELL', margin_required: 75000, margin_available: 70000, margin_status: 'issue' },
    { client_id: 'CL1001', stock: 'HDFCBANK', trade_type: 'BUY', margin_required: 120000, margin_available: 150000, margin_status: 'OK' },
    { client_id: 'CL1003', stock: 'INFY', trade_type: 'BUY', margin_required: 90000, margin_available: 95000, margin_status: 'OK' },
    { client_id: 'CL1002', stock: 'WIPRO', trade_type: 'SELL', margin_required: 40000, margin_available: 35000, margin_status: 'issue' },
    { client_id: 'CL1004', stock: 'ICICIBANK', trade_type: 'BUY', margin_required: 80000, margin_available: 80000, margin_status: 'OK' },
];

export function MarginReportTable() {
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<MarginRecord[]>([]);
    const [clientFilter, setClientFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleGenerateReport = async () => {
        setIsLoading(true);
        await new Promise(res => setTimeout(res, 1500));
        setReportData(mockData);
        setIsLoading(false);
    }

    const filteredData = useMemo(() => {
        return reportData.filter(record => {
            return (
                record.client_id.toLowerCase().includes(clientFilter.toLowerCase()) &&
                record.stock.toLowerCase().includes(stockFilter.toLowerCase()) &&
                (statusFilter === 'all' || record.margin_status === statusFilter)
            )
        })
    }, [reportData, clientFilter, stockFilter, statusFilter]);

    if(isLoading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
    }

    if(reportData.length === 0) {
        return (
            <div className="text-center py-20">
                <Button size="lg" onClick={handleGenerateReport}>Generate Daily Margin Report</Button>
                <p className="text-muted-foreground mt-4 text-sm">Click to generate the latest margin report.</p>
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
                            <span>Margin Details</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Filter by Client ID..." className="pl-8 w-full md:w-[200px]" value={clientFilter} onChange={e => setClientFilter(e.target.value)} />
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Filter by Stock..." className="pl-8 w-full md:w-[200px]" value={stockFilter} onChange={e => setStockFilter(e.target.value)} />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="OK">OK</SelectItem>
                                    <SelectItem value="issue">Issue</SelectItem>
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
                                <TableHead>Stock</TableHead>
                                <TableHead>Trade Type</TableHead>
                                <TableHead className="text-right">Margin Required</TableHead>
                                <TableHead className="text-right">Margin Available</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((record, index) => (
                                <TableRow key={index} className={cn(record.margin_status === 'issue' && 'bg-destructive/10 hover:bg-destructive/20')}>
                                    <TableCell className="font-medium">{record.client_id}</TableCell>
                                    <TableCell>{record.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={record.trade_type === 'BUY' ? 'secondary' : 'default'} className={cn(record.trade_type === 'BUY' && 'bg-blue-500/20 text-blue-700 border-blue-500/30')}>{record.trade_type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(record.margin_required)}</TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(record.margin_available)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={record.margin_status === 'OK' ? 'default' : 'destructive'} className={cn(record.margin_status === 'OK' && 'bg-green-500/20 text-green-700 border-green-500/30')}>
                                            {record.margin_status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </ThreeDCard>
    )
}
