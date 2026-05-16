"use client";

import "./globals.css";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import { 
  getProjects, Project, 
  getExperience, ExperienceItem, 
  getDecisions, Decision, 
  getSiteContent, SiteContent,
  getSkills, SkillGroup,
  getEducation, EducationItem
} from "@/lib/data-service";
import { motion } from "framer-motion";
import { Mail, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/Icons";

export default function Home() {
  const [data, setData] = useState<{
    projects: Project[];
    experience: ExperienceItem[];
    decisions: Decision[];
    skills: SkillGroup[];
    education: EducationItem[];
    content: SiteContent | null;
    loading: boolean;
  }>({
    projects: [],
    experience: [],
    decisions: [],
    skills: [],
    education: [],
    content: null,
    loading: true
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [projects, experience, decisions, content, skills, education] = await Promise.all([
          getProjects(),
          getExperience(),
          getDecisions(),
          getSiteContent(),
          getSkills(),
          getEducation()
        ]);
        setData({ projects, experience, decisions, content, skills, education, loading: false });
      } catch (err) {
        console.error("Failed to fetch data", err);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    fetchData();
  }, []);

  if (data.loading) {
    return <div className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading your experience...</div>;
  }

  const defaultContent = {
    name: "Nanang Eka Cahya Pernata",
    heroTitle: "Senior Backend-Focused Full-Stack Engineer",
    heroCopy: "I design reliable API platforms, microservices, and operational systems using Node.js, TypeScript, NestJS, PostgreSQL, Redis, Docker, and CI/CD practices.",
    heroMetadata: "Jakarta, Indonesia · Senior Backend Engineer · Senior Full-Stack Engineer · Technical Lead",
    introTitle: "Engineering leader focused on scale, ownership, and measurable impact.",
    introCopy: "Proven track record of leading technical delivery for national-scale platforms at Telkom Indonesia. I specialize in designing scalable backend architectures, optimizing API performance, and standardizing CI/CD discipline to ensure production readiness across complex environments.",
    email: "nanangcahya21@gmail.com",
    github: "https://github.com/nanangcahya",
    linkedin: "https://www.linkedin.com/in/nanangcahya/",
    instagram: "https://www.instagram.com/nanang_cahya/",
    profileUrl: "/nanang-eka-cahya-pernata-cv.pdf"
  };

  const content = { 
    ...defaultContent, 
    ...data.content,
    heroTitle: defaultContent.heroTitle,
    heroCopy: defaultContent.heroCopy,
    heroMetadata: defaultContent.heroMetadata,
    introTitle: defaultContent.introTitle,
    introCopy: defaultContent.introCopy,
    profileUrl: data.content?.profileUrl || defaultContent.profileUrl,
    email: data.content?.email || defaultContent.email,
    github: data.content?.github || defaultContent.github,
    linkedin: data.content?.linkedin || defaultContent.linkedin,
    instagram: data.content?.instagram || defaultContent.instagram
  };

  return (
    <main id="top">
      <Hero 
        name={content.name}
        title={content.heroTitle} 
        copy={content.heroCopy} 
        metadata={content.heroMetadata}
        email={content.email}
        linkedin={content.linkedin}
        cvUrl={content.profileUrl}
      />
      
      <section className="metrics" aria-label="Professional highlights">
        <article>
          <strong>Production scope</strong>
          <span>Telecom, licensing, monitoring, e-pharmacy, restaurant platforms</span>
        </article>
        <article>
          <strong>Lead engineer</strong>
          <span>Architecture, reviews, documentation, CI/CD, delivery coordination</span>
        </article>
        <article>
          <strong>Backend depth</strong>
          <span>Node.js, NestJS, ExpressJS, GraphQL, PostgreSQL, MySQL, Redis</span>
        </article>
        <article>
          <strong>Operational systems</strong>
          <span>Approval workflows, dashboards, APIs, integrations, deployment pipelines</span>
        </article>
      </section>

      <section className="section intro">
        <div>
          <p className="section-kicker">Profile</p>
          <h2>{content.introTitle}</h2>
        </div>
        <p>
          {content.introCopy}
        </p>
      </section>

      <section className="section process desktop-only">
        <div className="section-heading">
          <p className="section-kicker">How I work</p>
          <h2>From unclear workflow to production-ready system.</h2>
        </div>
        <div className="process-grid">
          <article>
            <span>01</span>
            <h3>Translate business needs</h3>
            <p>I turn stakeholder requests into API contracts, data models, delivery milestones, and technical plans that engineers can review and ship.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Design scalable APIs</h3>
            <p>I design services with maintainability, role-based access, integration reliability, database performance, and deployment safety in mind.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Lead delivery quality</h3>
            <p>I use code reviews, documentation, CI/CD discipline, and mentoring to keep delivery consistent across engineers and environments.</p>
          </article>
        </div>
      </section>

      <Work projects={data.projects} />

      <section id="decisions" className="section decisions desktop-only">
        <div className="section-heading">
          <p className="section-kicker">Senior-level ownership</p>
          <h2>Engineering decisions that drive quality.</h2>
        </div>
        <div className="decision-grid">
          <article>
            <h3>Split monolithic capabilities into service-oriented APIs</h3>
            <p>Moved backend capabilities toward service-oriented APIs where teams can reason about ownership, release risk, and performance independently.</p>
            <strong>Applied in OSS by separating submission, review, integration, and notification concerns.</strong>
          </article>
          <article>
            <h3>Designed workflow systems around roles and auditability</h3>
            <p>Modeled reviewer, admin, and operator flows with role-based access, traceable status changes, and clearer review visibility.</p>
            <strong>Applied in licensing and operational review systems with role-based access and traceable status changes.</strong>
          </article>
          <article>
            <h3>Standardized deployment discipline with CI/CD</h3>
            <p>Implemented robust GitLab CI/CD pipelines to reduce manual deployment risk and ensure consistent delivery across environments.</p>
            <strong>Applied across backend services using GitLab CI/CD, Docker, and Nginx to reduce manual release risk.</strong>
          </article>
        </div>
      </section>

      <Experience items={data.experience} />

      <Skills items={data.skills} />

      <section className="section education">
        <div>
          <p className="section-kicker">Education</p>
          <h2>Bachelor of Computer Science</h2>
          <p>Informatics Engineering — Indonesian Computer University (UNIKOM) — 2017</p>
        </div>
        <div>
          <p className="section-kicker">Languages</p>
          <h2>English and Bahasa Indonesia</h2>
          <p>English — professional working proficiency. Bahasa Indonesia — native proficiency.</p>
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>Need a senior engineer for backend systems, APIs, or technical delivery?</h2>
          <p>
            I am available for backend-heavy product work, internal tools, API platforms, technical leadership, and performance-focused web engineering.
          </p>
          <div className="contact-actions desktop-only">
            <a className="button primary light" href={`mailto:${content.email}`}>Email me</a>
            {content.profileUrl && <a className="button secondary light" href={content.profileUrl} download>Download CV</a>}
          </div>
        </div>
        <div className="contact-panel">
          <a href={`mailto:${content.email}`} title="Email" aria-label="Email">
            <Mail size={24} strokeWidth={1.5} />
            <span>Email me</span>
          </a>
          {content.profileUrl && (
            <a href={content.profileUrl} download title="Download CV" aria-label="Download CV">
              <Download size={24} />
              <span>Download CV</span>
            </a>
          )}
          {content.linkedin && (
            <a href={content.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <LinkedinIcon size={24} />
              <span>LinkedIn</span>
            </a>
          )}
          {content.github && (
            <a href={content.github} target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub">
              <GithubIcon size={24} />
              <span>GitHub</span>
            </a>
          )}
          {content.instagram && (
            <a href={content.instagram} target="_blank" rel="noreferrer" title="Instagram" aria-label="Instagram">
              <InstagramIcon size={24} />
              <span>Instagram</span>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
