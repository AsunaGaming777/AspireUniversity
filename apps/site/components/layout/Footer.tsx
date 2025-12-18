import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Linkedin, Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="h-12 w-auto relative">
                <Image
                  src="/aspire-logo.png"
                  alt="Aspire Academy"
                  width={120}
                  height={48}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The premier destination for elite AI education. Mastering the future, one intelligence at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-brand-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-gold transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-gold transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white mb-6">Programs</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-brand-gold transition-colors">All Courses</Link></li>
              <li><Link href="/courses/ai-foundations" className="hover:text-brand-gold transition-colors">AI Foundations</Link></li>
              <li><Link href="/courses/business" className="hover:text-brand-gold transition-colors">AI for Business</Link></li>
              <li><Link href="/courses/security" className="hover:text-brand-gold transition-colors">AI Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-brand-gold transition-colors">Insights Blog</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-gold transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-brand-gold transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aspire Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  )
}
