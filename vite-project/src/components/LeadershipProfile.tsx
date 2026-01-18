import { motion } from "framer-motion"

interface LeadershipProfileProps {
  role: string
  name: string
  image: string
  title?: string
  message: string
  personalTouch?: string
  alignment?: "left" | "right"
}

export function LeadershipProfile({
  role,
  name,
  image,
  title,
  message,
  personalTouch,
  alignment = "left",
}: LeadershipProfileProps) {
  const isLeft = alignment === "right"

  return (
    <section className="w-full bg-background">
      {/* Top gradient strip */}
      <div className="w-full px-4 py-10 lg:px-6 lg:py-10 bg-gradient-to-b from-background to-secondary/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">

          {/* IMAGE + QUOTE */}
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`flex flex-col gap-6 group ${isLeft ? "lg:order-1" : "lg:order-2"}`}
          >
            {/* Image container */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40">
  <img
    src={image}
    alt={name}
    className="w-full h-[580px] object-cover hover:scale-105 transition-transform duration-500"
  />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-accent/30 rounded-3xl"></div>
            </div>

            {/* Quote */}
            {personalTouch && (
              <div className=" p-2">
                <div className="flex items-start gap-2">
                  <span className="text-primary text-xl">"</span>
                  <p className="text-base font-medium text-foreground italic leading-relaxed">
                    {personalTouch}
                  </p>
                  <span className="text-primary text-2xl">"</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`space-y-3 max-w-2xl ${isLeft ? "lg:order-2" : "lg:order-1"}`}
          >
            {/* Role badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase">
                {role}
              </p>
            </div>

            {/* Name */}
            <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight tracking-tight">
              {name}
            </h1>

            {/* Title */}
            {title && (
              <div className="flex items-center">
               
              </div>
            )}

            {/* Message */}
            <p className="text-lg leading-relaxed text-foreground/80 font-light tracking-wide text-justify">
              {message}
            </p>

            {/* Accent line */}
            <div className="pt-4 flex gap-1">
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              <div className="w-4 h-1 bg-primary/40 rounded-full"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
