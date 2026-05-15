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
  items?: TimelineItem[];
}

export default function Experience({ items = [] }: ExperienceProps) {
  // Fallback if no items in DB
  const displayItems = (items && items.length > 0) ? items : [
    {
      id: "1",
      period: "2022 – Present",
      title: "Senior Backend Engineer",
      company: "PT Telkom Indonesia",
      highlights: [
        "Led backend development for national operational workflow platforms (OSS) using Node.js, NestJS, PostgreSQL, Redis, and GitLab CI/CD.",
        "Designed API contracts, data models, service boundaries, and release workflows for submission, review, and integration systems.",
        "Improved delivery consistency through code reviews, documentation, standardizing CI/CD pipelines, and mentoring junior engineers.",
        "Collaborated with cross-functional stakeholders to translate complex operational requirements into production-ready systems."
      ]
    },
    {
      id: "2",
      period: "2020 – 2022",
      title: "Backend Engineer",
      company: "PT Telkom Indonesia",
      highlights: [
        "Maintained and optimized high-traffic mobile APIs for national telecom products, ensuring production reliability and performance.",
        "Implemented real-time data ingestion and monitoring systems using Elasticsearch and Node.js for large-volume media record processing.",
        "Automated deployment workflows using Docker and Nginx, reducing manual release risks across multiple environments."
      ]
    },
    {
      id: "3",
      period: "2019 – 2020",
      title: "Web Engineer",
      company: "Various Platforms (Hungry/Other, G-Meds)",
      highlights: [
        "Delivered core backend features for pharmaceutical and document management systems within distributed international teams.",
        "Developed responsive administrative dashboards and integrated secure APIs to improve operational visibility for clinic partners."
      ]
    }
  ];

  const featuredItems = displayItems.slice(0, 3);
  const olderItems = displayItems.slice(3);

  return (
    <section id="experience" className="section split">
      <div className="section-heading sticky-heading">
        <p className="section-kicker">Experience</p>
        <h2>Roles, scope, and delivery ownership.</h2>
        <p className="experience-intro text-sm opacity-60 mt-4">Highlighting my most recent senior-level contributions and ownership.</p>
      </div>
      <div className="timeline">
        <div className="featured-experience">
          {featuredItems.map((item, index) => (
            <motion.article 
              key={item.id}
              className="featured-role"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <time>{item.period}</time>
              <div className="timeline-detail">
                <h3>{item.title}</h3>
                <p className="company-label">{item.company}</p>
                <ul>
                  {item.highlights.map((highlight, hIndex) => (
                    <li key={hIndex}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {olderItems.length > 0 && (
          <div className="earlier-experience mt-20 pt-16 border-t border-ink/5">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-terra mb-12">Career Foundations</h4>
            <div className="earlier-grid grid grid-cols-1 md:grid-cols-2 gap-8">
              {olderItems.map((item) => (
                <div key={item.id} className="earlier-item">
                  <span className="block font-mono text-[9px] opacity-40 mb-1">{item.period}</span>
                  <strong className="block text-sm mb-1">{item.title}</strong>
                  <span className="block text-xs opacity-60">{item.company}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
