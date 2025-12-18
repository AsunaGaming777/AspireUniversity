'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers'
import { Menu, X, User, BookOpen, Settings, LogOut, Shield } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const OWNER_EMAIL = 'azer.kasim@icloud.com'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-auto">
              <Image
                src="/aspire-logo.png"
                alt="Aspire Academy"
                width={120}
                height={40}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-white group-hover:text-brand-gold transition-colors duration-300">
              ASPIRE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200">
              Courses
            </Link>
            <Link href="/ai-tools" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200">
              AI Tools
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200">
              About
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-white"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-brand-dark-surface border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {user.email === OWNER_EMAIL && (
                      <Link
                        href="/admin/owner"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-brand-gold hover:bg-white/5 transition-colors font-semibold"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Owner Panel</span>
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-brand-gold hover:bg-white/5 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-brand-gold hover:bg-white/5 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-red-400 hover:bg-white/5 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-muted-foreground hover:text-white">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-black hover:bg-brand-gold hover:text-black transition-colors font-semibold">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-brand-black border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5">
          <nav className="flex flex-col p-6 space-y-6">
              <Link href="/courses" className="text-lg font-medium text-muted-foreground hover:text-brand-gold transition-colors">
                Courses
              </Link>
              <Link href="/ai-tools" className="text-lg font-medium text-muted-foreground hover:text-brand-gold transition-colors">
                AI Tools
              </Link>
              <Link href="/pricing" className="text-lg font-medium text-muted-foreground hover:text-brand-gold transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-lg font-medium text-muted-foreground hover:text-brand-gold transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-lg font-medium text-muted-foreground hover:text-brand-gold transition-colors">
                About
              </Link>
              
              <div className="h-px bg-white/10 my-4" />
              
              {user ? (
                <>
                  {user.email === OWNER_EMAIL && (
                    <Link href="/admin/owner" className="flex items-center space-x-2 text-lg font-medium text-brand-gold hover:text-white transition-colors">
                      <Shield className="w-5 h-5" />
                      <span>Owner Panel</span>
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-lg font-medium text-muted-foreground hover:text-brand-gold transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={() => signOut()} className="text-lg font-medium text-muted-foreground hover:text-red-400 transition-colors text-left">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="w-full justify-start text-lg">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-brand-gold text-black hover:bg-white">Get Started</Button>
                  </Link>
                </div>
              )}
          </nav>
        </div>
      )}
    </header>
  )
}
