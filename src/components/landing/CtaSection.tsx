import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section id="contact" className="scroll-mt-20 relative py-32 overflow-hidden bg-foreground text-background">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[150%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[120%] rounded-full bg-[#8cdcfe]/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
            Ready for Peace of Mind?
          </h2>
          <p className="text-xl text-slate-300 font-body max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who trust LifeTag to keep them safe. Get your smart bracelet today and setup your profile in minutes.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg group">
              Order Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              View Pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
