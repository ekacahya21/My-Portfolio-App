"use client";

import { motion } from "framer-motion";

interface TimelineItem {
  id: string;
  period: string;
  title: string;
  company: string;
  highlights: string[];
}

interface ExperienceProps {
  items: TimelineItem[];
}

export default function Experience({ items }: ExperienceProps) {
  return (
    <section id="experience" className="section split">
      <div className="section-heading sticky-heading">
        <p className="section-kicker">Experience</p>
        <h2>Roles, scope, and delivery ownership.</h2>
      </div>
      <div className="timeline">
        {items.map((item, index) => (
          <motion.article 
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <time>{item.period}</time>
            <div className="timeline-detail">
              <h3>{item.title}</h3>
              <p>{item.company}</p>
              <ul>
                {item.highlights.map((highlight, hIndex) => (
                  <li key={hIndex}>{highlight}</li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
