import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Battery, Shield, Globe, CloudLightning } from 'lucide-react'

const features = [
  {
    title: "No Batteries Required",
    description: "LifeTag operates using standard NFC technology. It draws power directly from the scanning smartphone, meaning it never needs charging.",
    icon: Battery,
  },
  {
    title: "Bank-Grade Security",
    description: "Your medical data is encrypted and securely stored. First responders only see what you explicitly choose to share.",
    icon: Shield,
  },
  {
    title: "Global Compatibility",
    description: "Whether you're at home or traveling abroad, LifeTag works instantly with any modern smartphone—no special apps needed.",
    icon: Globe,
  },
  {
    title: "Instant Cloud Updates",
    description: "Update your allergies, medications, or emergency contacts on the web portal, and your physical tag is updated instantly.",
    icon: CloudLightning,
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
}

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-24 bg-[#f8fbff] relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-foreground mb-4"
          >
            Why Choose LifeTag?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto font-body"
          >
            Designed from the ground up to be reliable, secure, and always ready when you need it.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="h-full flex flex-col p-6 bg-white hover:shadow-xl transition-shadow duration-300 border-none shadow-sm rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-[#8cdcfe]/20 flex items-center justify-center mb-6 text-primary">
                  <feature.icon size={24} strokeWidth={2} />
                </div>
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
