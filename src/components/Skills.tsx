"use client";

import { motion } from "framer-motion";
import { SkillGroup } from "@/lib/data-service";

interface SkillsProps {
  items: SkillGroup[];
}

export default function Skills({ items = [] }: SkillsProps) {
  // Fallback if no items in DB
  const displayItems = (items && items.length > 0) ? items : [
    {
      id: "1",
      title: "Primary depth",
      skills: "Node.js, TypeScript, NestJS, Express.js, REST APIs, PostgreSQL, Redis",
      order: 0
    },
    {
      id: "2",
      title: "Frontend",
      skills: "React, Next.js, Tailwind, HTML, CSS",
      order: 1
    },
    {
      id: "3",
      title: "Infrastructure",
      skills: "Docker, GitLab CI/CD, Nginx",
      order: 2
    },
    {
      id: "4",
      title: "Leadership",
      skills: "Code review, mentoring, documentation, Agile/Scrum",
      order: 3
    }
  ];

  return (
    <section id="skills" className="section skills-section">
      <div className="section-heading">
        <p className="section-kicker">Skills</p>
        <h2>Prioritized by depth and hiring relevance.</h2>
      </div>
      <div className="skill-columns">
        {displayItems.map((group, index) => (
          <motion.article 
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3>{group.title}</h3>
            <p>{group.skills}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
