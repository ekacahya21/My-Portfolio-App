"use client";

import { use, useEffect, useState } from "react";
import { getProjectById, Project } from "@/lib/data-service";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <main className="section min-h-screen flex items-center justify-center">
        <p className="font-mono text-terra animate-pulse">Loading project details...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="section min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl lg:text-6xl mb-8 tracking-tighter">Project not found</h1>
        <p className="text-ink/60 mb-12 max-w-md mx-auto">The project you are looking for might have been moved or deleted.</p>
        <Link href="/projects" className="button primary">Back to Projects</Link>
      </main>
    );
  }

  return (
    <main className="section pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 lg:mb-24"
      >
        <Link href="/projects" className="text-link font-mono text-[11px] uppercase tracking-widest mb-8 inline-block">
          ← Back to Projects
        </Link>
        <p className="section-kicker">{project.company}</p>
        <h1 className="text-5xl lg:text-8xl tracking-tighter mb-8 max-w-5xl">{project.title}</h1>
        <div className="flex flex-wrap gap-8 font-mono text-[12px] uppercase tracking-widest opacity-60">
          <div className="flex items-center gap-2">
            <span className="text-terra/40">PERIOD</span>
            <span className="text-ink font-bold">{project.period}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terra/40">STATUS</span>
            <span className="text-terra font-bold">{project.status || "Case study coming soon"}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
        <div className="lg:col-span-2 space-y-16 lg:space-y-24">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-terra opacity-60 mb-8">The Challenge & Role</h2>
            <div 
              className="text-xl lg:text-3xl leading-relaxed text-ink/80 font-medium rich-text-content max-w-none"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-terra opacity-60 mb-8">The Result</h2>
            <div className="bg-ink text-canvas p-10 lg:p-16 rounded-sm shadow-2xl">
              <p className="text-2xl lg:text-5xl font-bold leading-tight tracking-tight">
                {project.result}
              </p>
            </div>
          </motion.section>
        </div>

        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-12"
        >
          <div className="p-8 lg:p-10 border border-ink/10 rounded-sm bg-canvas/50 backdrop-blur-sm sticky top-32">
            <div className="mb-12">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-terra font-bold mb-6 block">Technical Stack</h3>
              <p className="text-lg lg:text-xl font-bold leading-relaxed font-mono text-ink/90">
                {project.technicalDepth}
              </p>
            </div>

            <div className="mb-12">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-terra font-bold mb-6 block">Scale & Impact</h3>
              <p className="text-lg lg:text-xl leading-relaxed font-semibold text-terra">
                {project.scaleImpact.replace(/^Impact:\s*/, '')}
              </p>
            </div>

            {project.caseStudyUrl ? (
              <a href={project.caseStudyUrl} className="button primary large w-full">
                Read Detailed Case Study
              </a>
            ) : (
              <div className="pt-8 border-t border-ink/5">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Detailed case study coming soon</span>
              </div>
            )}
          </div>
        </motion.aside>
      </div>

      <section className="mt-32 pt-32 border-t border-ink/10 text-center">
        <h2 className="text-3xl lg:text-5xl tracking-tighter mb-12">Interested in my approach?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/#contact" className="button primary large">Get in touch</Link>
          <Link href="/projects" className="button secondary large">View more work</Link>
        </div>
      </section>
    </main>
  );
}
