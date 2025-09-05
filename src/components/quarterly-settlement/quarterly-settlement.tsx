'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, FileDown, FileText, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ThreeDCard } from '../ui/3d-card'

export function QuarterlySettlement() {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRunSettlement = async () => {
    setIsLoading(true)
    setPdfUrl(null)
    setError(null)
    try {
      const response = await fetch('https://sebi-api-rbnmeqkvlq-uc.a.run.app/api/compliance/run-quarterly-settlement')
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API Error: ${response.statusText}`)
      }
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'quarterly_settlement_report.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setPdfUrl(url)

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
      setPdfUrl(null); // Reset state after download

      toast({
        title: 'Report Downloaded',
        description: 'The quarterly settlement report has been successfully downloaded.',
      })
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.'
      setError(errorMessage)
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
                <CardDescription>Click the button below to start the quarterly settlement process. The report will be downloaded automatically.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 py-10">
                <Button size="lg" onClick={handleRunSettlement} disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                    <FileDown className="mr-2 h-5 w-5" />
                    )}
                    Run & Download Settlement Report
                </Button>
                {error && !isLoading && (
                  <div className="text-center">
                    <div className="text-red-500 flex items-center gap-2">
                        <AlertCircle />
                        <span>{error}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleRunSettlement}>Retry</Button>
                  </div>
                )}
            </CardContent>
        </Card>
    </ThreeDCard>
  )
}
