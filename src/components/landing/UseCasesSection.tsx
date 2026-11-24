import { motion } from 'framer-motion'
import { Activity, Baby, Pill } from 'lucide-react'

const cases = [
  {
    title: "Athletes & Adventurers",
    description: "Perfect for runners, cyclists, and hikers who often exercise without carrying their wallet or ID.",
    icon: Activity,
    color: "from-orange-400/20 to-red-400/20",
    textColor: "text-orange-500"
  },
  {
    title: "Children & Seniors",
    description: "Provide peace of mind for vulnerable family members who may not be able to communicate their needs.",
    icon: Baby,
    color: "from-blue-400/20 to-cyan-400/20",
    textColor: "text-blue-500"
  },
  {
    title: "Chronic Conditions",
    description: "Instantly alert responders to allergies, diabetes, epilepsy, or necessary life-saving medications.",
    icon: Pill,
    color: "from-green-400/20 to-emerald-400/20",
    textColor: "text-green-500"
  }
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="scroll-mt-20 py-24 bg-white relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 space-y-6"
          >
            <h2 className="text-4xl font-display font-bold text-foreground">
              Who is LifeTag for?
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              Medical emergencies can happen to anyone, anywhere. LifeTag is designed to be a universal safety net, speaking for those who temporarily cannot speak for themselves.
            </p>
          </motion.div>

          <div className="flex-1 w-full space-y-6">
            {cases.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center ${item.textColor}`}>
                  <item.icon size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
