'use client'

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Play, Download, Zap, Tv, Cloud, Check, Search, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatNumber } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { SearchView } from "@/components/search-view"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://sapi.dramabox.be"

interface BookItem {
  bookId: string
  bookName: string
  cover: string
  introduction?: string
  tags?: string[]
  tagNames?: string[]
  playCount?: string | number
}

const extractList = (data: any): BookItem[] => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.searchList)) return data.searchList
  if (Array.isArray(data.rankList)) return data.rankList
  if (Array.isArray(data.list)) return data.list
  return []
}

export function Homepage() {
  const router = useRouter()
  const [featuredContent, setFeaturedContent] = useState<BookItem[]>([])
  const [trendingContent, setTrendingContent] = useState<BookItem[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)

    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/rank/1?lang=in`)
        const json = await res.json()
        if (json.success) {
          const list = extractList(json.data)
          setFeaturedContent(list.slice(0, 10))
        }
      } catch (e) {
        console.error("Failed to fetch featured", e)
      }
    }

    const fetchTrending = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/new/1?pageSize=8&lang=in`)
        const json = await res.json()
        if (json.success) {
          const list = extractList(json.data)
          setTrendingContent(list)
        }
      } catch (e) {
        console.error("Failed to fetch trending", e)
      }
    }

    fetchFeatured()
    fetchTrending()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight * 0.8
        if (isInView) {
          section.classList.add('is-visible')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goToWatch = (bookId: string) => {
    router.push(`/watch?bookId=${bookId}&source=homepage`)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center font-black text-lg">D</div>
            <span className="font-bold text-xl tracking-tight">DramaBox</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-transparent" />

        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className={cn("relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center transition-all duration-1000 transform", isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0")}>
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/15 backdrop-blur-md px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-3 h-3 mr-2" />
            Stream Unlimited Drama
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-tight">
            Your Stories,<br />Anywhere
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Discover thousands of premium drama series. Watch online or download episodes for offline viewing. HD quality, unlimited entertainment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => featuredContent[0] && goToWatch(featuredContent[0].bookId)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 gap-3"
            >
              <Play className="w-5 h-5 fill-white" />
              Start Watching
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base font-semibold backdrop-blur-md hover:scale-105 transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download App
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">10K+</div>
              <div className="text-sm text-white/50 font-medium">Episodes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">HD</div>
              <div className="text-sm text-white/50 font-medium">Quality</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">24/7</div>
              <div className="text-sm text-white/50 font-medium">Streaming</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      <section className="relative py-24 animate-on-scroll opacity-0 transition-all duration-1000 translate-y-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">Trending Now</h2>
              <p className="text-white/50 font-light">Most watched this week</p>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {featuredContent.map((item, index) => (
                <button
                  key={item.bookId}
                  onClick={() => goToWatch(item.bookId)}
                  className="flex-none w-[280px] md:w-[320px] group snap-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 mb-4 shadow-2xl shadow-black/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-red-600/30">
                    <img
                      src={item.cover}
                      alt={item.bookName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white border-0 font-bold text-xs">
                        #{index + 1}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.bookName}</h3>
                      <p className="text-xs text-white/70 line-clamp-2">{item.introduction || "Watch now"}</p>
                    </div>
                  </div>

                  <div className="px-1">
                    <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{item.bookName}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {formatNumber(item.playCount)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 animate-on-scroll opacity-0 transition-all duration-1000 translate-y-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-1.5 text-sm font-medium">
                <Download className="w-3 h-3 mr-2" />
                Smart Downloads
              </Badge>

              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                Watch Anytime,<br />Even Offline
              </h2>

              <p className="text-lg text-white/60 mb-8 leading-relaxed font-light">
                Download your favorite episodes and watch them offline. Save single episodes or bulk download entire seasons with a single tap.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Single Episode Download</h3>
                    <p className="text-sm text-white/50">Download individual episodes for quick offline access</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Bulk Download</h3>
                    <p className="text-sm text-white/50">Select multiple episodes and download them all at once</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Smart Storage</h3>
                    <p className="text-sm text-white/50">Automatically manage downloads and storage space</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 font-semibold hover:scale-105 transition-all duration-300"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-white/10 p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl">Download Episodes</h3>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      5 Selected
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((ep) => (
                      <div key={ep} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                        <div className="w-5 h-5 rounded border-2 border-purple-500 bg-purple-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-16 h-20 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">Episode {ep}</div>
                          <div className="text-xs text-white/50">45 min • HD</div>
                        </div>
                        <Download className="w-4 h-4 text-purple-400" />
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Selected
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 animate-on-scroll opacity-0 transition-all duration-1000 translate-y-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 text-sm font-medium">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Built for Your Lifestyle</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
              Premium features designed for the ultimate viewing experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                Instant playback with adaptive streaming. No buffering, just pure entertainment.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-green-500/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-500">
                <Tv className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">HD Quality</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                Crystal clear 1080p streaming with multiple quality options for any connection.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500">
                <Cloud className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Offline</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                Download episodes in advance and watch anywhere without internet.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500">
                <Sparkles className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cross-Device Sync</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                Start on your phone, continue on your tablet. Your progress syncs automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 animate-on-scroll opacity-0 transition-all duration-1000 translate-y-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <div className="relative h-full grid grid-cols-2 gap-4">
                {trendingContent.slice(0, 4).map((item, index) => (
                  <div
                    key={item.bookId}
                    className="rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => goToWatch(item.bookId)}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <img src={item.cover} alt={item.bookName} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Badge className="mb-6 bg-red-500/10 text-red-400 border-red-500/20 px-4 py-1.5 text-sm font-medium">
                Latest Releases
              </Badge>

              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                New Episodes<br />Every Week
              </h2>

              <p className="text-lg text-white/60 mb-8 leading-relaxed font-light">
                Never miss a beat. Fresh content added weekly, from trending series to exclusive originals. Your next favorite show is waiting.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => trendingContent[0] && goToWatch(trendingContent[0].bookId)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 h-12 font-semibold hover:scale-105 transition-all duration-300 gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Explore Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowSearch(true)}
                  className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-12 font-semibold hover:scale-105 transition-all duration-300"
                >
                  Browse All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center font-black text-lg">D</div>
                <span className="font-bold text-xl tracking-tight">DramaBox</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Stream unlimited drama series anytime, anywhere.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm">Product</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm">Support</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              © 2024 DramaBox. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">Instagram</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-sm">YouTube</a>
            </div>
          </div>
        </div>
      </footer>

      <Sheet open={showSearch} onOpenChange={setShowSearch}>
        <SheetContent side="top" className="h-full bg-black border-0 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>Search for drama series</SheetDescription>
          </SheetHeader>
          <SearchView isDialog onClose={() => setShowSearch(false)} />
        </SheetContent>
      </Sheet>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-on-scroll {
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .animate-on-scroll.is-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  )
}
