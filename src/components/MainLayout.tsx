"use client";

import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <header className="site-header" aria-label="Primary navigation">
          <a className="brand" href="/#top" aria-label="Nanang Eka Cahya Pernata home">
            NECP
          </a>
          <nav>
            <a href="/#work">Work</a>
            <a href="/#decisions">Decisions</a>
            <a href="/#experience">Experience</a>
            <a href="/#skills">Skills</a>
            <a href="/#contact">Contact</a>
          </nav>
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
