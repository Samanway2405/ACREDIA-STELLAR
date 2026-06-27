'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Building2, GraduationCap, Menu, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiteNavProps {
  currentPage?: 'home' | 'about';
}

export function SiteNav({ currentPage = 'home' }: SiteNavProps) {
  const router = useRouter();
  const [showSolutions, setShowSolutions] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

  const handleDashboardClick = (event: React.MouseEvent, dashboardType: 'student' | 'institution') => {
    event.preventDefault();
    router.push(dashboardType === 'student' ? '/solutions/students' : '/solutions/institutions');
  };

  const handleMouseEnter = () => setShowSolutions(true);
  const handleMouseLeave = () => setShowSolutions(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between rounded-2xl border border-teal-100/80 bg-white/95 px-2.5 py-2 shadow-[0_12px_32px_-20px_rgba(13,148,136,0.65)] md:hidden">
          <Link href="/" className="flex items-center space-x-2.5" onClick={() => setMobileNavOpen(false)}>
            <Image src="/logo.png" alt="Acredia Logo" width={34} height={34} className="rounded-lg" />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-[1.05rem] font-bold tracking-tight text-transparent">
              ACREDIA
            </span>
          </Link>
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10" aria-label="Toggle menu" onClick={() => { setMobileNavOpen((prev) => !prev); if (mobileNavOpen) setMobileSolutionsOpen(false); }}>
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileNavOpen && (
          <div className="mt-2 rounded-2xl border border-teal-100/90 bg-white p-2.5 shadow-[0_14px_36px_-24px_rgba(13,148,136,0.75)] md:hidden">
            <div className="flex flex-col gap-1.5">
              <Button type="button" variant="ghost" className="h-9 justify-between px-2.5 text-sm text-gray-700 hover:text-teal-600" onClick={() => setMobileSolutionsOpen((prev) => !prev)}>
                Solutions
                <svg className={`h-4 w-4 transition-transform duration-200 ${mobileSolutionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>

              {mobileSolutionsOpen && (
                <div className="grid grid-cols-1 gap-1.5 rounded-xl border border-gray-100 bg-gray-50 p-1.5">
                  <button onClick={(event) => { handleDashboardClick(event, 'institution'); setMobileNavOpen(false); setMobileSolutionsOpen(false); }} className="w-full rounded-lg border border-transparent bg-white p-2.5 text-left hover:border-teal-200 hover:bg-teal-50">
                    <p className="text-sm font-semibold text-gray-900">For Institutions</p>
                    <p className="mt-1 text-xs text-gray-600">Issue and manage credentials</p>
                  </button>
                  <button onClick={(event) => { handleDashboardClick(event, 'student'); setMobileNavOpen(false); setMobileSolutionsOpen(false); }} className="w-full rounded-lg border border-transparent bg-white p-2.5 text-left hover:border-cyan-200 hover:bg-cyan-50">
                    <p className="text-sm font-semibold text-gray-900">For Students</p>
                    <p className="mt-1 text-xs text-gray-600">View and share credentials</p>
                  </button>
                </div>
              )}

              <Link href="/about" onClick={() => setMobileNavOpen(false)}>
                <Button variant="ghost" className="h-9 w-full justify-start px-2.5 text-sm text-gray-700 hover:text-teal-600">About</Button>
              </Link>
              <Link href="/auth/login" onClick={() => setMobileNavOpen(false)}>
                <Button variant="ghost" className="h-9 w-full justify-start px-2.5 text-sm text-gray-700 hover:text-teal-600">Sign In</Button>
              </Link>
              <Link href="/verify" onClick={() => setMobileNavOpen(false)}>
                <Button className="h-10 w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-sm text-white hover:from-teal-700 hover:to-cyan-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="hidden md:flex md:items-center md:justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Acredia Logo" width={40} height={40} className="rounded-lg" />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">ACREDIA</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Button type="button" variant="ghost" className="flex items-center gap-1 text-gray-700 hover:text-teal-600">
                Solutions
                <svg className={`h-4 w-4 transition-transform duration-200 ${showSolutions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>

              {showSolutions && (
                <div className="absolute left-1/2 top-full mt-2 w-[95vw] max-w-[500px] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:w-[500px] sm:p-6" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <button onClick={(event) => handleDashboardClick(event, 'institution')} className="group w-full text-left">
                      <div className="flex flex-col items-center space-y-2 rounded-xl border-2 border-transparent p-4 transition-all duration-300 hover:border-teal-300 hover:bg-teal-50 hover:shadow-lg sm:space-y-3 sm:p-6">
                        <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-3 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:p-4">
                          <Building2 className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                        </div>
                        <div className="text-center">
                          <h3 className="mb-1 text-base font-bold text-gray-900 transition-colors group-hover:text-teal-600 sm:mb-2 sm:text-lg">For Institutions</h3>
                          <p className="px-2 text-xs text-gray-600 sm:text-sm">Issue and manage credentials for your students</p>
                        </div>
                      </div>
                    </button>
                    <button onClick={(event) => handleDashboardClick(event, 'student')} className="group w-full text-left">
                      <div className="flex flex-col items-center space-y-2 rounded-xl border-2 border-transparent p-4 transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-lg sm:space-y-3 sm:p-6">
                        <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:p-4">
                          <GraduationCap className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                        </div>
                        <div className="text-center">
                          <h3 className="mb-1 text-base font-bold text-gray-900 transition-colors group-hover:text-cyan-600 sm:mb-2 sm:text-lg">For Students</h3>
                          <p className="px-2 text-xs text-gray-600 sm:text-sm">View and share your academic credentials</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-4 sm:mt-6 sm:pt-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
                      <div className="text-center sm:text-left">
                        <p className="text-sm font-semibold text-gray-900">New to Acredia?</p>
                        <p className="text-xs text-gray-600">Join 500+ universities worldwide</p>
                      </div>
                      <Link href="/auth/register">
                        <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-sm text-white shadow-lg transition-all hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl sm:w-auto">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about">
              <Button variant="ghost" className={`px-3 text-sm sm:text-base ${currentPage === 'about' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}>About</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="px-3 text-sm text-gray-700 hover:text-teal-600 sm:text-base">Sign In</Button>
            </Link>
            <Link href="/verify">
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 px-3 text-sm text-white hover:from-teal-700 hover:to-cyan-700 sm:text-base">
                <Shield className="mr-2 h-4 w-4" />
                Verify
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
