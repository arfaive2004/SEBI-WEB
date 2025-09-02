'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThreeDCard } from '@/components/ui/3d-card'
import { Loader2, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

type FundsResult = {
  actual_balance: string
  required_funds: string
  status: 'PASS' | 'FAIL'
  surplus: string
}

export function FundsCheck() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<FundsResult | null>(null)

  const handleCheckFunds = async () => {
    setIsLoading(true)
    setResult(null)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const isPass = Math.random() > 0.3
    const mockResponse: FundsResult = isPass
      ? {
          actual_balance: '2,572,269.00',
          required_funds: '2,472,269.00',
          status: 'PASS',
          surplus: '100,000.00',
        }
      : {
          actual_balance: '1,850,112.00',
          required_funds: '2,122,500.00',
          status: 'FAIL',
          surplus: '-272,388.00',
        }
    
    setResult(mockResponse)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <Button size="lg" onClick={handleCheckFunds} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5" />
        )}
        Run Funds Check
      </Button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ThreeDCard className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-xl">Funds Compliance Report</h3>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold',
                    result.status === 'PASS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}
                >
                  {result.status === 'PASS' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                  {result.status}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <p className="text-muted-foreground">Actual Balance</p>
                  <p className="font-mono text-lg font-medium">{formatCurrency(result.actual_balance)}</p>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="text-muted-foreground">Required Funds</p>
                  <p className="font-mono text-lg font-medium">{formatCurrency(result.required_funds)}</p>
                </div>
                <div className="my-4 border-t border-dashed border-border"></div>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-lg">{result.status === 'PASS' ? 'Surplus' : 'Deficit'}</p>
                  <p className={cn(
                    'font-mono text-2xl font-bold',
                    result.status === 'PASS' ? 'text-green-600' : 'text-red-600'
                  )}>{formatCurrency(result.surplus)}</p>
                </div>
              </div>
            </div>
          </ThreeDCard>
        </motion.div>
      )}
    </div>
  )
}
