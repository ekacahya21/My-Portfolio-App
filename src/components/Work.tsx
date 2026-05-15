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
      title: "Online Single Submission (OSS)",
      result: "Led backend delivery for a national licensing workflow with review visibility, role-based approvals, and CI/CD release discipline.",
      description: "Designed API contracts, service boundaries, PostgreSQL data models, Redis-backed workflows, and deployment pipelines for operational stakeholders.",
      technicalDepth: "Node.js, NestJS, PostgreSQL, Redis, GitLab CI/CD, Microservices",
      scaleImpact: "Impact: Improved review traceability, reduced manual coordination, and established production release consistency for a national-scale platform.",
      status: "Featured Case Study"
    },
    {
      id: "2",
      company: "PT Telkom Indonesia",
      period: "2021 – 2022",
      title: "MyTelkomsel Mobile App APIs",
      result: "Maintained and improved production mobile APIs for a national telecom product with millions of active users.",
      description: "Optimized API response times and improved error handling for high-volume mobile traffic during a major service transition.",
      technicalDepth: "Node.js, Express.js, MySQL, Redis, Nginx, API Optimization",
      scaleImpact: "Impact: Improved API maintainability, deployment consistency, and migration readiness for high-pressure mobile service teams.",
      status: "Case study available"
    },
    {
      id: "3",
      company: "PT Telkom Indonesia",
      period: "2020 – 2021",
      title: "Media Monitoring System",
      result: "Delivered a monitoring backend and dashboard for operational media review, handling large-volume data workflows.",
      description: "Built the ingestion pipeline and administrative dashboard to monitor media sentiment and processing status in real-time.",
      technicalDepth: "Node.js, Vue.js, PostgreSQL, Elasticsearch, Real-time Ingestion",
      scaleImpact: "Impact: Improved visibility across monitoring workflows and reduced dependency on manual report checking for enterprise teams.",
      status: "Case study available"
    },
    {
      id: "4",
      company: "Freelance / Early Career",
      period: "2018 – 2019",
      title: "G-Meds Health Platform",
      result: "Developed core backend features for pharmaceutical procurement and distribution systems with distributed international teams.",
      description: "Implemented inventory management, order processing, and supplier integration APIs to digitize clinical supply chains.",
      technicalDepth: "Node.js, Express, MySQL, REST APIs, Documentation",
      scaleImpact: "Impact: Digitized manual pharmaceutical workflows, improving order accuracy and inventory visibility for clinic partners.",
      status: "Archive case study"
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
            <div className="result-line-container">
              <span className="result-label">RESULT</span>
              <p className="result-line-bold">{project.result}</p>
            </div>
            <p className="project-description-text">{project.description}</p>
            <dl className="proof-list">
              <div>
                <dt>Technical depth</dt>
                <dd>{project.technicalDepth}</dd>
              </div>
              <div>
                <dt>Scale and impact</dt>
                <dd className="impact-text">{project.scaleImpact}</dd>
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
