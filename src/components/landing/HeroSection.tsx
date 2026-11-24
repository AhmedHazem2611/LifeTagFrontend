import { motion } from 'framer-motion'
import { ArrowUpRight, Play, ShieldCheck, Users, Zap } from 'lucide-react'
import { scrollToSection } from './Navbar'
import heroBgPedestal from '../../assets/hero-bg-pedestal.png'
import braceletQr from '../../assets/bracelet-qr.png'
import braceletPin from '../../assets/bracelet-pin.png'
import heroMedkit from '../../assets/hero-medkit.png'
import heroClipboard from '../../assets/hero-clipboard.png'
import heroMapPin from '../../assets/hero-map-pin.png'

const TRUST_ITEMS = [
  {
    icon: Zap,
    label: 'Faster\nEmergency Response',
  },
  {
    icon: ShieldCheck,
    label: 'Secure &\nPrivacy-Focused',
  },
  {
    icon: Users,
    label: 'Person-Centered\nMedical Profile',
  },
] as const

function FloatingPlus({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`pointer-events-none select-none drop-shadow-[0_6px_12px_rgba(37,99,235,0.22)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clayPlusGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path
        d="M12 4a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 20 4v8h8a2.5 2.5 0 0 1 2.5 2.5v3A2.5 2.5 0 0 1 28 20h-8v8a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 12 28v-8H4a2.5 2.5 0 0 1-2.5-2.5v-3A2.5 2.5 0 0 1 4 12h8V4Z"
        fill="url(#clayPlusGrad)"
      />
    </svg>
  )
}

function StethoscopeDecor({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={`pointer-events-none select-none drop-shadow-[0_12px_20px_rgba(37,99,235,0.18)] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M48 16c-12 2-18 12-16 26 2 16 14 28 30 28s28-12 30-28c2-14-4-24-16-26"
        stroke="#1d6fd6"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="48" cy="16" r="5" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="2.5" />
      <circle cx="76" cy="16" r="5" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="2.5" />
      <path
        d="M62 70v12c0 12-10 22-22 22s-22-10-22-22V68"
        stroke="#2563eb"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="18" cy="60" r="13" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="3.5" />
      <circle cx="18" cy="60" r="6" fill="#93c5fd" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f3f8ff] via-[#e7f1fe] to-white pt-24 pb-12 lg:pt-0 lg:pb-0 lg:min-h-[760px] lg:h-[92vh] lg:max-h-[1080px] flex items-center"
    >
      {/* Full-Screen Desktop Wave Backdrop + Pedestal-Locked Visuals */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full min-w-[1380px] aspect-[16/9] pointer-events-none select-none">
        <img
          src={heroBgPedestal}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />

        {/* Stethoscope (top right) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[4.5%] top-[14%] w-[9.5%] z-20"
        >
          <StethoscopeDecor className="w-full h-auto" />
        </motion.div>

        {/* Floating Medical Kit (top left of bracelets) */}
        <motion.img
          src={heroMedkit}
          alt=""
          aria-hidden="true"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[46.5%] top-[16.5%] w-[13%] z-20 -rotate-12 drop-shadow-[0_18px_24px_rgba(30,64,175,0.18)]"
        />

        {/* Decorative '+' Crosses */}
        <FloatingPlus className="absolute left-[67.5%] top-[24%] w-[2.1%] z-20" />
        <FloatingPlus className="absolute left-[46.5%] top-[52%] w-[2.1%] z-20" />
        <FloatingPlus className="absolute right-[3.2%] top-[40.5%] w-[2.2%] z-20" />

        {/* Pedestal Shadows under Bracelets */}
        <div className="absolute left-[64.5%] -translate-x-1/2 top-[73.5%] w-[14%] h-[4.2%] rounded-full bg-[#1e40af]/20 blur-md z-10" />
        <div className="absolute left-[81%] -translate-x-1/2 top-[73.5%] w-[14%] h-[4.2%] rounded-full bg-[#1e40af]/20 blur-md z-10" />

        {/* QR Bracelet (left on pedestal) */}
        <motion.img
          src={braceletQr}
          alt="LifeTag smart medical bracelet QR emergency screen"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[46.5%] top-[33%] h-[44.5%] w-auto z-20 drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]"
        />

        {/* PIN Bracelet (right on pedestal) */}
        <motion.img
          src={braceletPin}
          alt="LifeTag smart medical bracelet PIN screen"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[70.5%] top-[30.5%] h-[47.5%] w-auto z-20 drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]"
        />

        {/* Clipboard + Heart (bottom left of pedestal) */}
        <motion.img
          src={heroClipboard}
          alt=""
          aria-hidden="true"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[42.5%] top-[59%] w-[15.5%] z-30 -rotate-6 drop-shadow-[0_18px_24px_rgba(30,64,175,0.18)]"
        />

        {/* Map + Red Pin (bottom right of pedestal) */}
        <motion.img
          src={heroMapPin}
          alt=""
          aria-hidden="true"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[1.5%] top-[63%] w-[14.5%] z-30 rotate-3 drop-shadow-[0_18px_24px_rgba(30,64,175,0.18)]"
        />
      </div>

      {/* Smooth bottom blend into FeaturesSection */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f8fbff] to-transparent pointer-events-none z-10"
      />

      {/* Foreground Content Container */}
      <div className="relative z-20 w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 lg:pt-12 flex flex-col gap-8">
        {/* Left Copy Column (100% upright & balanced) */}
        <div className="w-full lg:w-[46%] flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="space-y-5 sm:space-y-6 max-w-[540px]">
            <h1 className="text-[34px] sm:text-[46px] xl:text-[54px] font-display font-extrabold tracking-tight leading-[1.12] text-[#0d274d]">
              Your Medical Information,
              <span className="block text-[#0d86c9] mt-1">Always Within Reach</span>
            </h1>

            <p className="text-[15px] sm:text-[18px] text-[#3f5573] font-body leading-relaxed max-w-[490px] mx-auto lg:mx-0">
              Life Tag is a smart medical ID bracelet that keeps your essential health information accessible in emergencies — helping responders act faster and safer.
            </p>

            {/* Primary & Secondary Action Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-[15px] font-semibold text-white bg-gradient-to-r from-[#1a92eb] to-[#0464dc] shadow-[0_12px_26px_rgba(4,100,220,0.3)] hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <span>Get Life Tag</span>
                <ArrowUpRight size={17} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-[15px] font-semibold text-[#173257] bg-white/95 border border-[#bfd5f5] shadow-[0_6px_18px_rgba(148,176,220,0.22)] hover:bg-white hover:border-[#8ab4f8] active:scale-[0.98] transition-all"
              >
                <span className="w-5 h-5 rounded-full border border-[#173257]/70 flex items-center justify-center">
                  <Play size={10} fill="currentColor" className="ml-0.5" />
                </span>
                <span>Watch How It Works</span>
              </button>
            </div>

            {/* 3 Bottom Trust Indicators */}
            <div className="grid grid-cols-3 gap-2 pt-2 lg:pt-4 max-w-[520px] mx-auto lg:mx-0">
              {TRUST_ITEMS.map((item, idx) => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center text-center px-1.5 sm:px-2 ${
                    idx > 0 ? 'border-l border-slate-300/70' : ''
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e3effd] text-[#0e6ad8] flex items-center justify-center mb-1.5 sm:mb-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)]">
                    <item.icon size={17} strokeWidth={2.2} />
                  </div>
                  <span className="text-[11px] sm:text-[13px] font-medium text-[#1e3557] leading-snug whitespace-pre-line">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
