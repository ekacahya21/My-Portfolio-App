"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Project } from "@/lib/data-service";

interface ProjectCardProps {
  project: Project;
  index: number;
  isDesktopOnlyMobile?: boolean;
}

export default function ProjectCard({ project, index, isDesktopOnlyMobile = false }: ProjectCardProps) {
  return (
    <motion.article 
      className={`work-card ${isDesktopOnlyMobile ? 'desktop-only' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="card-topline">
        <span>{project.company}</span>
        <span>{project.period}</span>
      </div>
      <h3>
        <Link href={`/projects/${project.id}`} className="hover:text-terra transition-colors">
          {project.title}
        </Link>
      </h3>
      <div className="result-line-container">
        <span className="result-label">RESULT</span>
        <p className="result-line-bold">{project.result}</p>
      </div>
      <div 
        className="project-description-text desktop-only rich-text-content line-clamp-4 mt-6"
        dangerouslySetInnerHTML={{ __html: project.description }}
      />
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
      <div className="mt-auto pt-8 flex flex-wrap gap-4 items-center">
        <Link href={`/projects/${project.id}`} className="text-link font-mono text-[11px] uppercase tracking-widest">
          View Details →
        </Link>
        {project.caseStudyUrl && (
          <a className="text-link font-mono text-[11px] uppercase tracking-widest" href={project.caseStudyUrl}>Case Study</a>
        )}
        {!project.caseStudyUrl && (
          <span className="case-status text-terra font-mono text-[10px] uppercase tracking-widest">{project.status || "Case study coming soon"}</span>
        )}
      </div>
    </motion.article>
  );
}
