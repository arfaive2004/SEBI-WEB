'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, FileUp, Loader2, Send } from 'lucide-react'
import { ResultModal } from './result-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'

type VerificationResult = {
  status: 'success' | 'failed'
  data?: {
    Name: string
    "Father's Name": string
    DOB: string
    "PAN Number": string
    Address: string
    verificationStatus: string
  }
  reason?: string
}

export function OnboardingForm() {
  const [panFile, setPanFile] = useState<File | null>(null)
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState<File | null>(null)
  const [aadhaarBackFile, setAadhaarBackFile] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera: ", err)
      setShowCamera(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setShowCamera(false)
    }
  }, [])

  const takeSelfie = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight)
        const dataUrl = canvasRef.current.toDataURL('image/jpeg')
        setSelfie(dataUrl)
        stopCamera()
      }
    }
  }, [stopCamera])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!panFile || !aadhaarFrontFile || !aadhaarBackFile || !selfie) {
      // Show some error to the user
      return
    }
    setIsLoading(true)
    setResult(null)

    // Mocking API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const isSuccess = Math.random() > 0.3
    const mockResponse: VerificationResult = isSuccess
      ? {
          status: 'success',
          data: {
            Name: "ABHYUDAY RASTOGI",
            "Father's Name": "ANAND RASTOGI",
            DOB: "20/08/2004",
            "PAN Number": "HPPPR8346R",
            Address: "123, EXAMPLE STREET, NEW DELHI, INDIA",
            verificationStatus: "Verified",
          },
        }
      : {
          status: 'failed',
          reason: 'KYC data mismatch or extraction error.',
        }
    
    setResult(mockResponse)
    setIsLoading(false)
  }

  const isFormComplete = panFile && aadhaarFrontFile && aadhaarBackFile && selfie;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Upload Documents</CardTitle>
                    <CardDescription>Upload PAN and Aadhaar card images.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="pan">PAN Card Front</Label>
                        <Input id="pan" type="file" accept="image/*" onChange={(e) => setPanFile(e.target.files?.[0] || null)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aadhaar-front">Aadhaar Card Front</Label>
                        <Input id="aadhaar-front" type="file" accept="image/*" onChange={(e) => setAadhaarFrontFile(e.target.files?.[0] || null)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aadhaar-back">Aadhaar Card Back</Label>
                        <Input id="aadhaar-back" type="file" accept="image/*" onChange={(e) => setAadhaarBackFile(e.target.files?.[0] || null)} required />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Live Selfie</CardTitle>
                    <CardDescription>Capture a live selfie for verification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {showCamera && <video ref={videoRef} autoPlay className="h-full w-full object-cover"></video>}
                        {selfie && !showCamera && <Image src={selfie} alt="selfie" width={400} height={225} className="h-full w-full object-cover" />}
                        {!showCamera && !selfie && <Camera className="h-16 w-16 text-muted-foreground" />}
                    </div>
                     <canvas ref={canvasRef} className="hidden"></canvas>
                     {showCamera ? (
                        <div className='flex gap-2'>
                             <Button type="button" onClick={takeSelfie} className='w-full'>
                                <Camera className="mr-2 h-4 w-4" /> Take Selfie
                            </Button>
                            <Button type="button" onClick={stopCamera} variant="outline" className='w-full'>Cancel</Button>
                        </div>
                     ) : (
                        <Button type="button" onClick={startCamera} className='w-full'>
                            <Camera className="mr-2 h-4 w-4" /> {selfie ? 'Retake' : 'Open'} Camera
                        </Button>
                     )}
                </CardContent>
            </Card>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={!isFormComplete || isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Verify & Onboard Client
          </Button>
        </div>
      </form>
      {result && <ResultModal result={result} open={!!result} onOpenChange={() => setResult(null)} />}
    </>
  )
}
