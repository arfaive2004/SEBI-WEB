import { ThreeDCard } from '@/components/ui/3d-card'
import { CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '../ui/badge'

const topClients = [
    { rank: 1, name: 'Ashok Kumar', profit: 5_20_345.78, status: 'Up' },
    { rank: 2, name: 'Priya Sharma', profit: 4_80_912.45, status: 'Up' },
    { rank: 3, name: 'Rahul Verma', profit: 4_50_123.90, status: 'Down' },
    { rank: 4, name: 'Sunita Singh', profit: 3_99_876.12, status: 'Up' },
    { rank: 5, name: 'Vikram Mehta', profit: 3_50_654.32, status: 'Down' },
];

export function TopClientsCard() {
    return (
        <ThreeDCard className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Top 5 Clients by Profit</CardTitle>
                <CardDescription>Highest profit generating clients today.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Rank</TableHead>
                            <TableHead>Client Name</TableHead>
                            <TableHead className="text-right">Profit</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topClients.map((client) => (
                            <TableRow key={client.rank}>
                                <TableCell className="font-medium">{client.rank}</TableCell>
                                <TableCell>{client.name}</TableCell>
                                <TableCell className="text-right font-mono">{formatCurrency(client.profit)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={client.status === 'Up' ? 'default' : 'destructive'}>{client.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </ThreeDCard>
    )
}
