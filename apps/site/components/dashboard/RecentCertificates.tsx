'use client'

import Link from 'next/link'
import { Award, Download, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'

interface Certificate {
  id: string
  courseId: string | null
  title: string
  completedAt: Date
  issuedAt: Date
  verificationUrl: string
}

interface RecentCertificatesProps {
  certificates: Certificate[]
}

export function RecentCertificates({ certificates }: RecentCertificatesProps) {
  if (certificates.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-gold/10 rounded-lg">
            <Award className="w-5 h-5 text-brand-gold" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Certificates</h3>
        </div>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">No certificates yet</p>
          <p className="text-xs text-muted-foreground">
            Complete courses to earn certificates
          </p>
        </div>
      </div>
    )
  }

  const recentCertificates = certificates.slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/10 rounded-lg">
            <Award className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Recent Certificates</h3>
            <p className="text-xs text-muted-foreground">{certificates.length} earned</p>
          </div>
        </div>
        {certificates.length > 3 && (
          <Link
            href="/dashboard/certificates"
            className="text-sm text-brand-gold hover:text-brand-deep-gold transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {recentCertificates.map((certificate) => (
          <div
            key={certificate.id}
            className="flex items-center gap-3 p-3 bg-brand-black rounded-lg hover:bg-brand-black/80 transition-colors border border-brand-gold/10"
          >
            <div className="p-2 bg-brand-gold/10 rounded-lg">
              <Award className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm mb-1 truncate">
                {certificate.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                Earned {formatDate(certificate.issuedAt)}
              </p>
            </div>
            <a
              href={certificate.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-brand-gold/10 rounded-lg transition-colors"
              title="Verify certificate"
            >
              <ExternalLink className="w-4 h-4 text-brand-gold" />
            </a>
          </div>
        ))}
      </div>

      {certificates.length > 0 && (
        <Link
          href="/dashboard/certificates"
          className="mt-4 block text-center text-sm text-brand-gold hover:text-brand-deep-gold transition-colors"
        >
          View all certificates →
        </Link>
      )}
    </div>
  )
}

