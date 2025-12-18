"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { useTheme } from "../providers/ThemeContext";
import { GradientText } from "../ui/GradientText";
import { portfolioConfig } from "@/config/portfolio";

export function ContactSection() {
  const { theme } = useTheme();
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

    // Clear form
    setFormState({
      name: "",
      email: "",
      message: "",
    });
  };

  const inputStyle = {
    backgroundColor: theme === "sunrise"
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(10, 20, 30, 0.5)",
    borderColor: theme === "sunrise"
      ? "rgba(255, 126, 51, 0.3)"
      : "rgba(139, 92, 246, 0.3)",
    color: "var(--text-primary)",
  };

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-6"
      id="contact"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Let&apos;s{" "}
            <GradientText colors={{
              sunrise: "linear-gradient(135deg, #ff7e33, #ff9500)",
              sunset: "linear-gradient(135deg, #8b5cf6, #22d3ee)"
            }}>
              Connect
            </GradientText>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            I&apos;m currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-8 md:p-12" glowOpacity={0.5}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      ...inputStyle,
                      // @ts-expect-error CSS custom property
                      "--tw-ring-color": "var(--accent-primary)",
                    }}
                    placeholder="Your name"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2"
                    style={inputStyle}
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 resize-none"
                  style={inputStyle}
                  placeholder="Tell me about your project..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="flex justify-center"
              >
                <Button variant="solid" onClick={handleSubmit}>
                  Send Message
                </Button>
              </motion.div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-6 mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          {portfolioConfig.personalInfo.socials.map((social, index) => (
            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
              <Button variant="hollow" magneticStrength={0.3}>{social.platform}</Button>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ContactSection;
