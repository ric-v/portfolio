"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { portfolioConfig } from "@/config/portfolio";
import { usePlanetNavigation } from "@/hooks/usePlanetNavigation";

export function ContactSection() {
  const { currentPlanet } = usePlanetNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from Portfolio: ${formState.name}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`);
    window.location.href = `mailto:${portfolioConfig.contact.email}?subject=${subject}&body=${body}`;

    setFormState({
      name: "",
      email: "",
      message: "",
    });
  };

  const inputStyle = {
    backgroundColor: `${currentPlanet.surface.primary}60`,
    borderColor: `${currentPlanet.text.accent}40`,
    color: currentPlanet.text.primary,
  };

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6"
      id="contact"
    >
      <div className="max-w-4xl mx-auto">
        {/* Planet indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="text-4xl" role="img" aria-label="Neptune">🔵</span>
          <span
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: currentPlanet.text.accent }}
          >
            Neptune Station
          </span>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: currentPlanet.text.primary }}
          >
            Let&apos;s{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentPlanet.text.accent}, ${currentPlanet.surface.glow})`,
              }}
            >
              Connect
            </span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: currentPlanet.text.secondary }}
          >
            I&apos;m always open to discussing new opportunities and interesting projects.
            Feel free to reach out!
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="p-8 md:p-12 rounded-xl backdrop-blur-sm"
            style={{
              backgroundColor: `${currentPlanet.surface.primary}40`,
              border: `1px solid ${currentPlanet.text.accent}30`,
              boxShadow: `0 0 40px ${currentPlanet.surface.glow}15`,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-3"
                    style={{ color: currentPlanet.text.secondary }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-500 focus:outline-none focus:ring-2"
                    style={{
                      ...inputStyle,
                      // @ts-expect-error CSS custom property
                      "--tw-ring-color": currentPlanet.text.accent,
                    }}
                    placeholder="Your name"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-3"
                    style={{ color: currentPlanet.text.secondary }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-500 focus:outline-none focus:ring-2"
                    style={inputStyle}
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-3"
                  style={{ color: currentPlanet.text.secondary }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-500 focus:outline-none focus:ring-2 resize-none"
                  style={inputStyle}
                  placeholder="Tell me about your project or opportunity..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex justify-center"
              >
                <motion.button
                  type="submit"
                  className="px-8 py-3 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: currentPlanet.text.accent,
                    color: currentPlanet.atmosphere.deepSpace,
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 30px ${currentPlanet.surface.glow}50`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-4 mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {portfolioConfig.personalInfo.socials.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                className="px-6 py-3 rounded-lg text-sm font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentPlanet.text.accent}`,
                  color: currentPlanet.text.accent,
                }}
                whileHover={{
                  backgroundColor: `${currentPlanet.text.accent}20`,
                }}
              >
                {social.platform}
              </motion.button>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ContactSection;
