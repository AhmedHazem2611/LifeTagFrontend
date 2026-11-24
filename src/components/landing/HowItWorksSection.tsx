import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Smartphone, HeartPulse, ShieldCheck } from 'lucide-react'

const steps = [
  {
    title: "1. Wear It",
    description: "Comfortable, waterproof, and designed for everyday use. Your LifeTag stays with you wherever you go.",
    icon: ShieldCheck,
  },
  {
    title: "2. Tap to Scan",
    description: "First responders simply tap their smartphone to your bracelet using NFC technology—no app required.",
    icon: Smartphone,
  },
  {
    title: "3. Access Profile",
    description: "Critical medical data, emergency contacts, and allergies are instantly displayed securely.",
    icon: HeartPulse,
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-24 bg-white relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-foreground mb-4"
          >
            How LifeTag Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto font-body"
          >
            A seamless experience designed to save seconds when they matter most.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="h-full flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <step.icon size={32} strokeWidth={1.5} />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <CardDescription className="text-base leading-relaxed">{step.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
