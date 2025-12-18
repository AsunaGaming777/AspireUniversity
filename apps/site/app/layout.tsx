import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Cinzel } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer' // Assuming Footer component exists or needs to be created

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ASPIRE - The Apex of AI Mastery',
    template: '%s | ASPIRE',
  },
  description: 'Join the elite. Master applied AI, defensive security, and automated wealth generation. The only education that matters in the age of AGI.',
  keywords: [
    'AI education',
    'Elite AI training',
    'AI for business',
    'High ticket AI',
    'AI security',
    'Prompt engineering mastery',
  ],
  authors: [{ name: 'Aspire Academy' }],
  creator: 'Aspire',
  publisher: 'Aspire',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ASPIRE',
    title: 'ASPIRE - The Apex of AI Mastery',
    description: 'Join the elite. Master applied AI, defensive security, and automated wealth generation.',
    images: [
      {
        url: '/aspire-logo.png',
        width: 1200,
        height: 630,
        alt: 'ASPIRE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASPIRE - The Apex of AI Mastery',
    description: 'Join the elite. Master applied AI, defensive security, and automated wealth generation.',
    images: ['/aspire-logo.png'],
    creator: '@AspireAI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cinzel.variable}`}>
      <head>
        <link rel="icon" href="/aspire-logo.png" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#09090b] text-white">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
