import { MainLayout } from '@/components/main-layout'
import { MetricCard } from '@/components/dashboard/metric-card'
import { TopClientsCard } from '@/components/dashboard/top-clients-card'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Users, UserPlus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's your brokerage overview for today.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Brokerage"
            icon={BarChart}
            value={formatCurrency(12345678.90)}
            change="+5.2% from last month"
            changeType="increase"
          />
          <MetricCard
            title="Active Clients"
            icon={Users}
            value="1,254"
            change="+12 clients today"
            changeType="increase"
          />
          <MetricCard
            title="New Clients"
            icon={UserPlus}
            value="32"
            change="+3 since yesterday"
            changeType="increase"
          />
        </div>
        <TopClientsCard />
      </div>
    </MainLayout>
  )
}
