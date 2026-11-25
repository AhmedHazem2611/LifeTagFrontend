import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/logo.png'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'contact', label: 'Contact' },
] as const

const NAVBAR_HEIGHT = 80

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (!el) return
  const targetTop = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - (sectionId === 'home' ? 0 : NAVBAR_HEIGHT - 8)
  )
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}

export function Navbar() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string>('home')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16)

      // If scrolled to the very bottom, highlight Contact cleanly
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
        setActiveId('contact')
        return
      }

      const scrollMarker = window.scrollY + NAVBAR_HEIGHT + 80
      let current = 'home'
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= scrollMarker) {
            current = item.id
          }
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id: string) => {
    setActiveId(id)
    setMobileOpen(false)
    scrollToSection(id)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-[0_8px_30px_rgba(15,37,71,0.06)] border-b border-blue-100/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('home')
          }}
          aria-label="Go to top"
          className="flex items-center focus:outline-none hover:scale-105 transition-transform"
        >
          <img src={logo} alt="LifeTag Logo" className="h-12 w-auto object-contain drop-shadow-sm" />
        </a>

        {/* Center: Section Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                }}
                className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#dbeafe]/85 text-[#0f3c75] font-semibold shadow-sm'
                    : 'text-[#1e293b]/80 hover:text-[#005adc] hover:bg-white/60'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Right: Mobile Toggle + Login Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-xl bg-white/80 text-slate-700 border border-blue-100 shadow-sm"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false)
              navigate('/signin')
            }}
            className="px-7 py-2.5 rounded-full text-[14px] font-semibold text-white bg-gradient-to-r from-[#1a92eb] to-[#0464dc] shadow-[0_8px_20px_rgba(4,100,220,0.3)] hover:brightness-105 active:scale-95 transition-all"
          >
            Login
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 pb-4 pt-2 flex flex-col gap-1 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#dbeafe]/80 text-[#0f3c75] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      )}
    </header>
  )
}
