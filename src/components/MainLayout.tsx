"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSiteContent } from "@/lib/data-service";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [cvUrl, setCvUrl] = useState("/nanang-eka-cahya-pernata-cv.pdf");

  useEffect(() => {
    async function fetchCv() {
      try {
        const content = await getSiteContent();
        if (content?.profileUrl) {
          setCvUrl(content.profileUrl);
        }
      } catch (e) {
        // use default
      }
    }
    if (!isAdmin) {
      fetchCv();
    }
  }, [isAdmin]);

  return (
    <>
      {!isAdmin && (
        <header className="site-header" aria-label="Primary navigation">
          <a className="brand" href="/#top" aria-label="Nanang Eka Cahya Pernata home">
            NECP
          </a>
          <nav className="desktop-only">
            <a href="/#work">Work</a>
            <a href="/#decisions">Decisions</a>
            <a href="/#experience">Experience</a>
            <a href="/#skills">Skills</a>
            <a href="/#contact">Contact</a>
          </nav>
          <div className="mobile-only">
            <a href={cvUrl} download className="button primary" style={{ padding: '8px 16px', fontSize: '10px' }}>
              Download CV
            </a>
          </div>
        </header>
      )}
      {children}
      {!isAdmin && (
        <footer>
          <p>Nanang Eka Cahya Pernata</p>
          <p>Senior Web Engineer based in Jakarta, Indonesia.</p>
        </footer>
      )}
    </>
  );
}
