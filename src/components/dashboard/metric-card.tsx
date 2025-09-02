import { ThreeDCard } from '@/components/ui/3d-card'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'

type MetricCardProps = {
  icon: LucideIcon
  title: string
  value: string
  change?: string
  changeType?: 'increase' | 'decrease'
}

export function MetricCard({ icon: Icon, title, value, change, changeType }: MetricCardProps) {
  return (
    <ThreeDCard>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline">{value}</div>
          {change && (
            <p className={cn("text-xs text-muted-foreground", changeType === 'increase' ? 'text-green-600' : 'text-red-600')}>
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    </ThreeDCard>
  )
}
