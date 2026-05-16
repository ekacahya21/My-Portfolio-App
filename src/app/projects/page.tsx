"use client";

import { useEffect, useState } from "react";
import { getProjects, Project } from "@/lib/data-service";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main className="section min-h-screen flex items-center justify-center">
        <p className="font-mono text-terra animate-pulse">Loading projects...</p>
      </main>
    );
  }

  return (
    <main className="section pt-32">
      <div className="mb-16">
        <Link href="/" className="text-link font-mono text-[11px] uppercase tracking-widest mb-8 inline-block">
          ← Back to Home
        </Link>
        <p className="section-kicker">Portfolio</p>
        <h1 className="text-5xl lg:text-8xl tracking-tighter mb-8">All Projects</h1>
        <p className="text-xl lg:text-2xl text-ink/70 leading-relaxed max-w-3xl">
          A comprehensive list of engineering projects, ranging from national-scale platforms to specialized internal tools.
        </p>
      </div>

      <div className="work-grid">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
          />
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-24 border border-dashed border-ink/20">
          <p className="text-ink/50 font-mono">No projects found in the database.</p>
        </div>
      )}
    </main>
  );
}
