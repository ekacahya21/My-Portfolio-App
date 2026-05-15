"use client";

import { motion } from "framer-motion";

interface Project {
  id: string;
  company: string;
  period: string;
  title: string;
  result: string;
  description: string;
  technicalDepth: string;
  scaleImpact: string;
  caseStudyUrl?: string;
  status?: string;
}

interface WorkProps {
  projects: Project[];
}

export default function Work({ projects }: WorkProps) {
  return (
    <section id="work" className="section">
      <div className="section-heading">
        <p className="section-kicker">Selected work</p>
        <h2>Projects with real operational weight.</h2>
      </div>
      <div className="work-grid">
        {projects.map((project, index) => (
          <motion.article 
            key={project.id} 
            className="work-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="card-topline">
              <span>{project.company}</span>
              <span>{project.period}</span>
            </div>
            <h3>{project.title}</h3>
            <p className="result-line">
              Result: {project.result}
            </p>
            <p>{project.description}</p>
            <dl className="proof-list">
              <div>
                <dt>Technical depth</dt>
                <dd>{project.technicalDepth}</dd>
              </div>
              <div>
                <dt>Scale and impact</dt>
                <dd>{project.scaleImpact}</dd>
              </div>
            </dl>
            {project.caseStudyUrl ? (
              <a className="text-link" href={project.caseStudyUrl}>Featured case study</a>
            ) : (
              <span className="case-status">{project.status || "Case study coming soon"}</span>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
