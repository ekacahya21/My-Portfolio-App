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
    heroTitle: "Nanang Eka Cahya Pernata",
    heroCopy: "Senior Web Engineer based in Jakarta.",
    introTitle: "I design and deliver backend systems behind production web products.",
    introCopy: "I turn complex operational requirements into API contracts, data models, service boundaries, and release-ready systems.",
    email: "nanangcahya21@gmail.com",
    github: "https://github.com/nanangcahya",
    linkedin: "https://www.linkedin.com/in/nanangcahya/"
  };

  const content = data.content || defaultContent;

  return (
    <main id="top">
      <Hero 
        title={content.heroTitle} 
        copy={content.heroCopy} 
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

      <section className="section process">
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

      <section id="decisions" className="section decisions">
        <div className="section-heading">
          <p className="section-kicker">Engineering decisions</p>
          <h2>Examples of senior-level ownership.</h2>
        </div>
        <div className="decision-grid">
          {data.decisions.length > 0 ? data.decisions.map(decision => (
            <article key={decision.id}>
              <h3>{decision.title}</h3>
              <p>{decision.description}</p>
              <strong>Example: {decision.example}</strong>
            </article>
          )) : (
            <>
              <article>
                <h3>Split monolithic capabilities into service-oriented APIs</h3>
                <p>Helped move backend capabilities toward smaller API services where teams could reason about ownership, release risk, and performance independently.</p>
                <strong>Example: applied in Online Single Submission by separating submission, review, integration, and workflow concerns.</strong>
              </article>
            </>
          )}
        </div>
      </section>

      <Experience items={data.experience} />

      <Skills items={data.skills} />

      <section className="section education">
        <div>
          <p className="section-kicker">Education</p>
          {data.education.length > 0 ? data.education.map(item => (
            <div key={item.id} className="mb-6">
              <h2>{item.degree}</h2>
              <p>{item.institution}, {item.period}</p>
              {item.description && <p className="text-sm opacity-70 mt-2">{item.description}</p>}
            </div>
          )) : (
            <div>
              <h2>Bachelor of Computer Science</h2>
              <p>Informatics Engineering, Indonesian Computer University (UNIKOM), 2017</p>
            </div>
          )}
        </div>
        <div>
          <p className="section-kicker">Languages</p>
          <h2>English and Bahasa Indonesia</h2>
          <p>English professional working proficiency. Bahasa Indonesia native proficiency.</p>
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>Need a senior engineer for backend systems, APIs, or technical delivery?</h2>
          <p>
            I am available for backend-heavy product work, internal tools, API platforms, technical leadership, and performance-focused web engineering.
          </p>
          <div className="contact-actions">
            <a className="button primary light" href={`mailto:${content.email}`}>Email me</a>
            {content.profileUrl && <a className="button secondary light" href={content.profileUrl} download>Download CV</a>}
          </div>
        </div>
        <div className="contact-panel">
          <a href={`mailto:${content.email}`}>{content.email}</a>
          {content.github && <a href={content.github} target="_blank" rel="noreferrer">GitHub</a>}
          {content.linkedin && <a href={content.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
        </div>
      </section>
    </main>
  );
}
