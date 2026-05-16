import ProjectCard from "./ProjectCard";
import Link from "next/link";

import { Project } from "@/lib/data-service";

interface WorkProps {
  projects: Project[];
}

export default function Work({ projects = [] }: WorkProps) {
  // Fallback if no projects in DB
  const displayProjects: Project[] = (projects && projects.length > 0) ? projects.slice(0, 6) : [
    {
      id: "1",
      company: "PT Telkom Indonesia",
      period: "2022 – Present",
      title: "Online Single Submission",
      result: "Led backend delivery for a national licensing workflow with role-based approvals, review visibility, and CI/CD release discipline.",
      description: "Designed API contracts, service boundaries, PostgreSQL data models, Redis-backed workflows, and deployment pipelines for operational stakeholders.",
      technicalDepth: "Node.js, NestJS, PostgreSQL, Redis, GitLab CI/CD",
      scaleImpact: "Improved traceability and reduced manual coordination across operational review workflows.",
      status: "Featured Case Study",
      order: 1
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
      status: "Case study available",
      order: 3
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
      status: "Case study available",
      order: 2
    }
  ];

  return (
    <section id="work" className="section">
      <div className="section-heading">
        <p className="section-kicker">Selected work</p>
        <h2>Projects with real operational weight.</h2>
      </div>
      <div className="work-grid">
        {displayProjects.slice(0, 4).map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            isDesktopOnlyMobile={index >= 3}
          />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/projects" className="button secondary">View more projects</Link>
      </div>
    </section>
  );
}
