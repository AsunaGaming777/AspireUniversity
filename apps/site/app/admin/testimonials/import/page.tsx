'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Eye,
  Trash2
} from 'lucide-react'

interface TestimonialImport {
  id: string
  name: string
  title: string
  company: string
  content: string
  rating: number
  earnings: number | null
  proofUrl: string | null
  consentGiven: boolean
  verified: boolean
  status: 'pending' | 'approved' | 'rejected'
  errors: string[]
}

export default function TestimonialImportPage() {
  const [testimonials, setTestimonials] = useState<TestimonialImport[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialImport | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/testimonials/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setTestimonials(result.testimonials)
        setUploadProgress(100)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading file: ' + (error as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleApproveTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'POST'
      })

      if (response.ok) {
        setTestimonials(prev => 
          prev.map(t => t.id === id ? { ...t, status: 'approved' as const } : t)
        )
      }
    } catch (error) {
      console.error('Error approving testimonial:', error)
    }
  }

  const handleRejectTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/reject`, {
        method: 'POST'
      })

      if (response.ok) {
        setTestimonials(prev => 
          prev.map(t => t.id === id ? { ...t, status: 'rejected' as const } : t)
        )
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `name,title,company,content,rating,earnings,proofUrl,consentGiven
"John Doe","Software Engineer","Tech Corp","This course changed my career!","5","50000","https://example.com/proof","true"
"Jane Smith","Data Scientist","AI Startup","Amazing content and support!","5","75000","https://example.com/proof2","true"`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'testimonials_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Import Testimonials
          </h1>
          <p className="text-brand-muted-text">
            Import and manage real user testimonials with verification
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Import Testimonials</CardTitle>
            <CardDescription>
              Upload a CSV file with real user testimonials. All testimonials must include explicit consent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Choose CSV File
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-brand-muted-text">
                  Processing testimonials... {uploadProgress}%
                </p>
              </div>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Only import testimonials with explicit consent. 
                All testimonials must include proof of earnings and consent verification.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Testimonials List */}
        {testimonials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Imported Testimonials</CardTitle>
              <CardDescription>
                Review and approve imported testimonials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-brand-muted-text">
                          {testimonial.title} at {testimonial.company}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          testimonial.status === 'approved' ? 'default' :
                          testimonial.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {testimonial.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTestimonial(testimonial)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-brand-muted-text line-clamp-3">
                        {testimonial.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-brand-muted-text">Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {testimonial.earnings && (
                          <div className="text-sm text-brand-muted-text">
                            Earnings: ${testimonial.earnings.toLocaleString()}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-brand-muted-text">Consent:</span>
                          {testimonial.consentGiven ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      </div>

                      {testimonial.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveTestimonial(testimonial.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectTestimonial(testimonial.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>

                    {testimonial.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-red-400">Errors:</p>
                        <ul className="text-sm text-red-400 list-disc list-inside">
                          {testimonial.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testimonial Detail Modal */}
        {selectedTestimonial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Testimonial Details</CardTitle>
                <CardDescription>
                  Review testimonial before approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">Name & Title</h3>
                  <p className="text-brand-muted-text">
                    {selectedTestimonial.name} - {selectedTestimonial.title} at {selectedTestimonial.company}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Content</h3>
                  <p className="text-brand-muted-text">
                    {selectedTestimonial.content}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-white">Rating</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < selectedTestimonial.rating ? 'text-yellow-400' : 'text-gray-500'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedTestimonial.earnings && (
                    <div>
                      <h3 className="font-semibold text-white">Earnings</h3>
                      <p className="text-brand-muted-text">
                        ${selectedTestimonial.earnings.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {selectedTestimonial.proofUrl && (
                  <div>
                    <h3 className="font-semibold text-white">Proof URL</h3>
                    <a 
                      href={selectedTestimonial.proofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-gold hover:underline"
                    >
                      {selectedTestimonial.proofUrl}
                    </a>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-brand-muted-text">Consent Given:</span>
                    {selectedTestimonial.consentGiven ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-brand-muted-text">Verified:</span>
                    {selectedTestimonial.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTestimonial(null)}
                  >
                    Close
                  </Button>
                  {selectedTestimonial.status === 'pending' && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleRejectTestimonial(selectedTestimonial.id)
                          setSelectedTestimonial(null)
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          handleApproveTestimonial(selectedTestimonial.id)
                          setSelectedTestimonial(null)
                        }}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


