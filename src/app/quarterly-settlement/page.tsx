import { MainLayout } from '@/components/main-layout'
import { QuarterlySettlement } from '@/components/quarterly-settlement/quarterly-settlement'
import { FileText } from 'lucide-react'

export default function QuarterlySettlementPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-4 md:items-center">
             <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <FileText className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Quarterly Settlement</h1>
                <p className="text-muted-foreground">Run the quarterly settlement process and download the report.</p>
            </div>
        </div>
        <QuarterlySettlement />
      </div>
    </MainLayout>
  )
}
