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

export default function Work({ projects = [] }: WorkProps) {
  // Fallback if no projects in DB
  const displayProjects = (projects && projects.length > 0) ? projects.slice(0, 4) : [
    {
      id: "1",
      company: "PT Telkom Indonesia",
      period: "2022 – Present",
      title: "Online Single Submission",
      result: "Led backend delivery for a national licensing workflow with role-based approvals, review visibility, and CI/CD release discipline.",
      description: "Designed API contracts, service boundaries, PostgreSQL data models, Redis-backed workflows, and deployment pipelines for operational stakeholders.",
      technicalDepth: "Node.js, NestJS, PostgreSQL, Redis, GitLab CI/CD",
      scaleImpact: "Improved traceability and reduced manual coordination across operational review workflows.",
      status: "Featured Case Study"
    },
    {
      id: "3",
      company: "PT Telkom Indonesia",
      period: "2020 – 2021",
      title: "Media Monitoring System",
      result: "Delivered monitoring backend and dashboard workflows for operational media review.",
      description: "Built the ingestion pipeline and administrative dashboard to monitor media sentiment and processing status in real-time.",
      technicalDepth: "Node.js, PostgreSQL, Redis, dashboard APIs",
      scaleImpact: "Improved visibility across ingestion, filtering, and review processes.",
      status: "Case study available"
    },
    {
      id: "2",
      company: "PT Telkom Indonesia",
      period: "2021 – 2022",
      title: "MyTelkomsel Mobile App APIs",
      result: "Maintained production mobile APIs for a national telecom product.",
      description: "Optimized API response times and improved error handling for high-volume mobile traffic during a major service transition.",
      technicalDepth: "Node.js, NestJS, Express.js, Redis, MySQL",
      scaleImpact: "Improved maintainability, deployment consistency, and migration readiness.",
      status: "Case study available"
    }
  ];

  return (
    <section id="work" className="section">
      <div className="section-heading">
        <p className="section-kicker">Selected work</p>
        <h2>Projects with real operational weight.</h2>
      </div>
      <div className="work-grid">
        {displayProjects.map((project, index) => (
          <motion.article 
            key={project.id} 
            className={`work-card ${index >= 3 ? 'desktop-only' : ''}`}
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
            <div className="result-line-container">
              <span className="result-label">RESULT</span>
              <p className="result-line-bold">{project.result}</p>
            </div>
            <p className="project-description-text desktop-only">{project.description}</p>
            <dl className="proof-list mt-8 lg:mt-10 pt-8 lg:pt-10">
              <div>
                <dt>Stack</dt>
                <dd className="font-mono text-[14px] lg:text-[15px] opacity-80">{project.technicalDepth}</dd>
              </div>
              <div>
                <dt>Impact</dt>
                <dd className="impact-text font-normal">{project.scaleImpact.replace(/^Impact:\s*/, '')}</dd>
              </div>
            </dl>
            {project.caseStudyUrl ? (
              <a className="text-link mt-8 block" href={project.caseStudyUrl}>Read case study →</a>
            ) : (
              <span className="case-status mt-8 block text-terra font-mono text-[10px] uppercase tracking-widest">{project.status || "Case study coming soon"}</span>
            )}
          </motion.article>
        ))}
      </div>
      <div className="mt-12 text-center mobile-only">
         <a href="#" className="button secondary">View more projects</a>
      </div>
    </section>
  );
}
