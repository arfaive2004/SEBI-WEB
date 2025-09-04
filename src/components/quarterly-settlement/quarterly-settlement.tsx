'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, FileDown, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ThreeDCard } from '../ui/3d-card'

export function QuarterlySettlement() {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRunSettlement = async () => {
    setIsLoading(true)
    setPdfUrl(null)
    try {
      const response = await fetch('http://127.0.0.1:5000/api/compliance/run-quarterly-settlement')
      if (!response.ok) {
        throw new Error('Failed to generate settlement report')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setPdfUrl(url)
      toast({
        title: 'Report Generated',
        description: 'The quarterly settlement report is ready for download.',
      })
    } catch (error) {
      console.error('Error running quarterly settlement:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate the quarterly settlement report.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThreeDCard>
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="font-headline">Generate Report</CardTitle>
                <CardDescription>Click the button below to start the quarterly settlement process. This may take a few moments.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 py-10">
                <Button size="lg" onClick={handleRunSettlement} disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                    <FileText className="mr-2 h-5 w-5" />
                    )}
                    Run Quarterly Settlement
                </Button>
                {pdfUrl && (
                    <a href={pdfUrl} download="quarterly_settlement_report.pdf">
                        <Button size="lg" variant="outline">
                            <FileDown className="mr-2 h-5 w-5" />
                            Download Report
                        </Button>
                    </a>
                )}
            </CardContent>
        </Card>
    </ThreeDCard>
  )
}
