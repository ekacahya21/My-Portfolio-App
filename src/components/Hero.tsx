"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
  title?: string;
  copy?: string;
}

export default function Hero({ title, copy }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let nodes: any[] = [];
    let animationFrame = 0;
    let requestRef: number;

    const palette = ["#164b3d", "#0f766e", "#b54d36", "#244c79", "#c08a2d"];

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = Math.floor(width * ratio);
      canvas!.height = Math.floor(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(22, Math.floor(width / 44));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: width * (0.52 + Math.random() * 0.48),
        y: Math.random() * height,
        radius: 2 + Math.random() * 3.5,
        speed: 0.18 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        color: palette[index % palette.length],
      }));
    }

    function draw() {
      context!.clearRect(0, 0, width, height);
      context!.lineWidth = 1;

      nodes.forEach((node, index) => {
        node.y += node.speed;
        node.x += Math.sin(animationFrame / 80 + node.phase) * 0.18;

        if (node.y > height + 20) {
          node.y = -20;
          node.x = width * (0.52 + Math.random() * 0.48);
        }

        for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
          const nextNode = nodes[nextIndex];
          const distance = Math.hypot(node.x - nextNode.x, node.y - nextNode.y);

          if (distance < 155) {
            context!.strokeStyle = `rgba(23, 33, 29, ${0.07 * (1 - distance / 155)})`;
            context!.beginPath();
            context!.moveTo(node.x, node.y);
            context!.lineTo(nextNode.x, nextNode.y);
            context!.stroke();
          }
        }

        context!.fillStyle = node.color;
        context!.globalAlpha = 0.48;
        context!.beginPath();
        context!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context!.fill();
        context!.globalAlpha = 1;
      });

      animationFrame += 1;
      requestRef = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} id="system-canvas" aria-hidden="true"></canvas>
      <div className="hero-inner">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="eyebrow">Senior Web Engineer - Jakarta, Indonesia</p>
          <h1>{title || "Nanang Eka Cahya Pernata"}</h1>
          <p className="hero-copy">
            {copy || "Backend-focused full-stack engineer building reliable API platforms, microservices, and operational systems for teams that need maintainable architecture and dependable delivery."}
          </p>
          <div className="hero-actions" aria-label="Contact actions">
            <a className="button primary" href="mailto:nanangcahya21@gmail.com">Email me</a>
            <a className="button secondary" href="/nanang-eka-cahya-pernata-cv.pdf" download>Download CV</a>
            <a className="button secondary" href="#work">View work</a>
          </div>
          <div className="availability" aria-label="Available for">
            <span>Target roles</span>
            <strong>Senior Backend Engineer</strong>
            <strong>Senior Full-Stack Engineer</strong>
            <strong>Technical Lead</strong>
          </div>
        </motion.div>
        
        <motion.aside 
          className="hero-skills-panel" 
          aria-label="Professional skills"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="profile-summary">
            <div className="profile-avatar">
              <Image 
                src="/profile.jpg" 
                alt="Portrait of Nanang Eka Cahya Pernata" 
                width={900} 
                height={900} 
                priority
              />
            </div>
            <div>
              <span>Core skill profile</span>
              <strong>Production APIs, microservices, and delivery leadership</strong>
            </div>
          </div>
          <div className="hero-skill-list">
            <article>
              <span>Primary depth</span>
              <strong>Node.js, TypeScript, NestJS, ExpressJS, REST API, GraphQL, PostgreSQL</strong>
            </article>
            <article>
              <span>System ownership</span>
              <strong>Microservice architecture, API integration, scalability, role-based workflows</strong>
            </article>
            <article>
              <span>Delivery quality</span>
              <strong>GitLab CI/CD, Docker, Nginx, code reviews, documentation, mentoring</strong>
            </article>
            <article>
              <span>Working breadth</span>
              <strong>React, Vue, Nuxt, Redis, MySQL, Elasticsearch, operational dashboards</strong>
            </article>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
