"use client";

import "../../admin.css";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  getProjects, saveProject, Project, 
  getExperience, saveExperience, ExperienceItem,
  getDecisions, saveDecision, Decision,
  getSiteContent, saveSiteContent, SiteContent,
  getSkills, saveSkill, SkillGroup,
  getEducation, saveEducation, EducationItem
} from "@/lib/data-service";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Tab = "overview" | "hero" | "profile" | "projects" | "experience" | "skills" | "education" | "settings";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "overview");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<{
    projects: Project[];
    experience: ExperienceItem[];
    decisions: Decision[];
    skills: SkillGroup[];
    education: EducationItem[];
    content: SiteContent | null;
  }>({
    projects: [],
    experience: [],
    decisions: [],
    skills: [],
    education: [],
    content: null
  });

  const defaultContent: SiteContent = {
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

  const currentContent = { ...defaultContent, ...data.content };

  // Sync state with URL when tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as Tab;
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  async function fetchAllData() {
    const [projects, experience, decisions, content, skills, education] = await Promise.all([
      getProjects(),
      getExperience(),
      getDecisions(),
      getSiteContent(),
      getSkills(),
      getEducation()
    ]);
    setData({ projects, experience, decisions, content, skills, education });
  }

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [confirmState, setConfirmState] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
  }>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const requestConfirm = (title: string, message: string, onConfirm: () => void, confirmLabel = "Confirm") => {
    setConfirmState({ show: true, title, message, onConfirm, confirmLabel });
  };

  const handleLogout = () => {
    requestConfirm(
      "Sign Out?",
      "Are you sure you want to log out of the admin dashboard?",
      () => { if (auth) signOut(auth).then(() => router.push("/admin/login")); },
      "Log Out"
    );
  };

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-background">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background font-body-md text-body-md">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-[3000] px-6 py-3 rounded shadow-2xl flex items-center gap-3 font-label-caps text-[11px] tracking-widest ${
              toast.type === "success" ? "bg-primary text-on-primary" : "bg-error text-on-error"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-[var(--admin-bar-height,0px)] h-[calc(100vh-var(--admin-bar-height,0px))] w-[280px] bg-surface-container border-r border-outline-variant flex flex-col p-6 z-50">
        {/* Brand Header */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <div>
              <h1 className="font-headline-md text-xl font-bold text-primary">Portfolio CMS</h1>
              <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70">Senior Web Engineer</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-1">
          <SidebarLink icon="dashboard" label="Dashboard" active={activeTab === "overview"} onClick={() => handleTabChange("overview")} />
          <SidebarLink icon="view_quilt" label="Hero Section" active={activeTab === "hero"} onClick={() => handleTabChange("hero")} />
          <SidebarLink icon="account_circle" label="Profile & Bio" active={activeTab === "profile"} onClick={() => handleTabChange("profile")} />
          <SidebarLink icon="work_history" label="Projects" active={activeTab === "projects"} onClick={() => handleTabChange("projects")} />
          <SidebarLink icon="description" label="Experience" active={activeTab === "experience"} onClick={() => handleTabChange("experience")} />
          <SidebarLink icon="psychology" label="Skills" active={activeTab === "skills"} onClick={() => handleTabChange("skills")} />
          <SidebarLink icon="school" label="Education" active={activeTab === "education"} onClick={() => handleTabChange("education")} />
        </nav>

        {/* CTA & Footer */}
        <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant">
          <Link href="/" target="_blank" className="w-full bg-primary text-on-primary py-3 px-4 rounded font-label-caps text-[10px] text-center uppercase tracking-widest hover:opacity-90 transition-opacity block">
            Preview Portfolio
          </Link>
          <div className="space-y-1">
            <button onClick={() => handleTabChange("settings")} className={`flex items-center w-full gap-3 px-4 py-2 rounded transition-colors ${activeTab === 'settings' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">settings</span>
              <span className="font-body-md text-sm">Settings</span>
            </button>
            <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-2 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-body-md text-sm">Log Out</span>
            </button>
          </div>
          {/* Profile Info */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <img alt="Avatar" className="w-8 h-8 rounded-full border border-outline-variant" src={data.content?.avatarUrl || "/profile.jpg"}/>
            <div className="overflow-hidden">
              <p className="font-label-caps text-[9px] truncate leading-tight">LOGGED IN AS</p>
              <p className="font-body-md text-xs font-bold truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen ml-[280px]">
        {/* TopAppBar Shell */}
        <header className="sticky top-[var(--admin-bar-height,0px)] z-40 w-full bg-surface border-b border-outline-variant flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-secondary" placeholder="Search content..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full transition-colors">notifications</button>
            <div className="h-8 w-px bg-outline-variant mx-2"></div>
            <button className="bg-primary text-on-primary px-6 py-2 rounded font-label-caps text-[11px] shadow-sm hover:opacity-90 transition-all active:scale-95">Admin Connected</button>
          </div>
        </header>

        <main className="flex-1 p-12 lg:p-20 overflow-y-auto">
          {activeTab === "overview" && <OverviewTab data={{ ...data, content: currentContent }} setTab={handleTabChange} />}
          {activeTab === "hero" && <HeroTab content={currentContent} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} />}
          {activeTab === "profile" && <ProfileTab content={currentContent} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} />}
          {activeTab === "projects" && <ProjectsTab items={data.projects} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} requestConfirm={requestConfirm} />}
          {activeTab === "experience" && <ExperienceTab items={data.experience} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} requestConfirm={requestConfirm} />}
          {activeTab === "skills" && <SkillsTab items={data.skills} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} requestConfirm={requestConfirm} />}
          {activeTab === "education" && <EducationTab items={data.education} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} requestConfirm={requestConfirm} />}
          {activeTab === "settings" && <SettingsTab content={currentContent} refresh={fetchAllData} showToast={showToast} isSaving={isSaving} setIsSaving={setIsSaving} requestConfirm={requestConfirm} />}
        
          <footer className="mt-20 border-t border-outline-variant pt-8 pb-8 flex justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant">PORTFOLIO CMS V3.0.0 — MODERN EDITORIAL ENGINE</p>
            <div className="flex gap-8">
              <a className="font-label-caps text-[10px] hover:text-primary transition-colors" href="#">DOCUMENTATION</a>
              <a className="font-label-caps text-[10px] hover:text-primary transition-colors" href="#">SYSTEM STATUS</a>
            </div>
          </footer>
        </main>

        <AnimatePresence>
          {confirmState.show && (
            <ConfirmationModal 
              title={confirmState.title}
              message={confirmState.message}
              confirmLabel={confirmState.confirmLabel}
              onConfirm={() => {
                confirmState.onConfirm();
                setConfirmState(prev => ({ ...prev, show: false }));
              }}
              onClose={() => setConfirmState(prev => ({ ...prev, show: false }))}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center w-full gap-3 px-4 py-3 rounded transition-colors ${active ? 'text-primary font-bold bg-surface-container-high scale-[0.98]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-body-md text-sm">{label}</span>
    </button>
  );
}

// --- TAB COMPONENTS ---

function OverviewTab({ data, setTab }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="mb-16 flex justify-between items-end">
        <div>
          <p className="font-label-caps text-secondary mb-2">DASHBOARD OVERVIEW</p>
          <h2 className="font-display-xl text-5xl">Welcome back.</h2>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex items-center gap-4 shadow-sm">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          <div>
            <p className="font-label-caps text-[10px] text-on-surface-variant">SYSTEM STATUS</p>
            <p className="font-data-ui text-xs font-semibold">Active & Live</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-surface-container-lowest border border-outline-variant p-8 group hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-label-caps text-[11px] text-on-surface-variant">QUICK VIEW: HERO SECTION</h3>
            <button onClick={() => setTab("hero")} className="material-symbols-outlined text-on-surface-variant opacity-40 group-hover:opacity-100">edit</button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-2">HEADLINE</label>
              <h4 className="font-headline-lg text-3xl font-bold">{data.content?.heroTitle || "Nanang Eka Cahya Pernata"}</h4>
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-2">SUBTEXT</label>
              <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed max-w-2xl">
                {data.content?.heroCopy || "Senior Web Engineer based in Jakarta."}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-primary text-on-primary p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-label-caps text-[11px] opacity-60 mb-6">CORE SKILL PROFILE</h3>
            <div className="flex flex-col gap-4">
              {data.skills.slice(0, 1).map((group: any) => (
                <div key={group.id} className="p-4 bg-primary-container border border-on-primary-container/20">
                  <p className="font-label-caps text-[9px] text-on-primary-container">{group.title}</p>
                  <p className="font-body-md font-semibold text-white truncate">{group.skills}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8">
            <img alt="Avatar" className="w-16 h-16 grayscale hover:grayscale-0 transition-all duration-500 border-2 border-on-primary p-1" src={data.content?.avatarUrl || "/profile.jpg"}/>
          </div>
        </div>

        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant">
          <div className="p-8 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-label-caps text-[11px] text-on-surface-variant">RECENT PROJECTS</h3>
            <button onClick={() => setTab("projects")} className="font-label-caps text-[10px] text-secondary hover:underline">MANAGE ALL</button>
          </div>
          <div className="divide-y divide-outline-variant">
            {data.projects.slice(0, 3).map((project: any) => (
              <div key={project.id} className="p-8 flex gap-6 hover:bg-surface-container-low transition-colors">
                <div className="font-data-ui text-xs text-on-surface-variant whitespace-nowrap pt-1">{project.period}</div>
                <div>
                  <h4 className="font-headline-md text-xl font-bold">{project.title}</h4>
                  <p className="font-body-md text-on-surface-variant">{project.company}</p>
                </div>
                <button className="ml-auto material-symbols-outlined text-on-surface-variant">open_in_new</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroTab({ content, refresh, showToast, isSaving, setIsSaving }: any) {
  const [form, setForm] = useState(content || { heroTitle: "", heroCopy: "" });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSiteContent(form);
      showToast("Hero section updated successfully!");
      refresh();
    } catch (e) {
      showToast("Failed to save changes. Check permissions.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12">
        <p className="font-label-caps text-secondary mb-2">CONTENT EDITOR</p>
        <h2 className="font-display-xl text-5xl">Hero Section</h2>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant p-10 space-y-10 max-w-4xl">
        <div className="space-y-4">
          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Headline</label>
          <input 
            className="w-full bg-transparent border-b border-outline-variant py-4 font-headline-lg text-3xl font-bold focus:outline-none focus:border-primary transition-colors"
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Introduction Copy</label>
          <textarea 
            className="w-full bg-transparent border-b border-outline-variant py-4 font-body-lg text-lg focus:outline-none focus:border-primary transition-colors min-h-[200px] resize-none"
            value={form.heroCopy}
            onChange={(e) => setForm({ ...form, heroCopy: e.target.value })}
          />
        </div>
        <div className="pt-6">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary text-on-primary px-10 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>
            {isSaving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileTab({ content, refresh, showToast, isSaving, setIsSaving }: any) {
  const [form, setForm] = useState(content || { introTitle: "", introCopy: "", email: "", github: "", linkedin: "", instagram: "", avatarUrl: "", profileUrl: "" });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSiteContent(form);
      showToast("Profile information saved!");
      refresh();
    } catch (e) {
      showToast("Failed to save biography.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12">
        <p className="font-label-caps text-secondary mb-2">CONTENT EDITOR</p>
        <h2 className="font-display-xl text-5xl">Profile & Bio</h2>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant p-10 space-y-10 max-w-4xl">
        <div className="grid grid-cols-2 gap-8">
          <Input label="EMAIL ADDRESS" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} />
          <Input label="AVATAR URL" value={form.avatarUrl} onChange={(v: string) => setForm({ ...form, avatarUrl: v })} />
          <Input label="GITHUB URL" value={form.github} onChange={(v: string) => setForm({ ...form, github: v })} />
          <Input label="LINKEDIN URL" value={form.linkedin} onChange={(v: string) => setForm({ ...form, linkedin: v })} />
          <Input label="INSTAGRAM URL" value={form.instagram} onChange={(v: string) => setForm({ ...form, instagram: v })} />
        </div>
        <div className="space-y-4">
          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Intro Headline</label>
          <input 
            className="w-full bg-transparent border-b border-outline-variant py-4 font-headline-md text-2xl font-semibold focus:outline-none focus:border-primary transition-colors"
            value={form.introTitle}
            onChange={(e) => setForm({ ...form, introTitle: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Full Biography</label>
          <textarea 
            className="w-full bg-transparent border-b border-outline-variant py-4 font-body-md text-base focus:outline-none focus:border-primary transition-colors min-h-[250px] resize-none"
            value={form.introCopy}
            onChange={(e) => setForm({ ...form, introCopy: e.target.value })}
          />
        </div>
        <div className="pt-6">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary text-on-primary px-10 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>
            {isSaving ? 'Saving...' : 'Save Biography'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

async function deleteItem(collectionName: string, id: string, refresh: () => void, showToast: (m: string) => void, requestConfirm: any) {
  requestConfirm(
    "Delete Item?",
    "Are you sure you want to delete this item? This action cannot be undone.",
    async () => {
      if (!db) return;
      await deleteDoc(doc(db, collectionName, id));
      showToast("Item deleted successfully.");
      refresh();
    },
    "Delete"
  );
}

function ProjectsTab({ items, refresh, showToast, isSaving, setIsSaving, requestConfirm }: any) {
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      await saveProject(editingProject);
      showToast("Project saved!");
      setEditingProject(null);
      refresh();
    } catch (e) {
      showToast("Failed to save project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="font-label-caps text-secondary mb-2">PORTFOLIO</p>
          <h2 className="font-display-xl text-5xl">Projects</h2>
        </div>
        <button 
          onClick={() => setEditingProject({ id: Date.now().toString(), title: '', company: '', period: '', result: '', description: '', technicalDepth: '', scaleImpact: '', order: items.length })}
          className="bg-primary text-on-primary px-8 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
        >
          <span className="material-symbols-outlined">add</span>
          Add Project
        </button>
      </div>

      <div className="grid gap-6">
        {items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((project: any) => (
          <div key={project.id} className="bg-surface-container-lowest border border-outline-variant p-8 flex justify-between items-start group hover:border-primary transition-colors">
            <div>
              <p className="font-label-caps text-[10px] text-secondary mb-2">{project.company} — {project.period}</p>
              <h3 className="font-headline-md text-xl mb-4 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-2xl line-clamp-2">{project.result}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProject(project)} className="p-3 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button onClick={() => deleteItem('projects', project.id, refresh, showToast, requestConfirm)} className="p-3 hover:bg-error-container rounded-full transition-colors text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingProject && (
          <Modal onClose={() => setEditingProject(null)}>
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="font-display-xl text-3xl">Edit Project</h3>
                <button onClick={() => setEditingProject(null)} className="material-symbols-outlined">close</button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Input label="PROJECT TITLE" value={editingProject.title} onChange={(v: string) => setEditingProject({...editingProject, title: v})} />
                <Input label="COMPANY" value={editingProject.company} onChange={(v: string) => setEditingProject({...editingProject, company: v})} />
                <Input label="PERIOD" value={editingProject.period} onChange={(v: string) => setEditingProject({...editingProject, period: v})} />
                <Input label="RESULT HIGHLIGHT" value={editingProject.result} onChange={(v: string) => setEditingProject({...editingProject, result: v})} />
              </div>
              <Textarea label="DETAILED DESCRIPTION" value={editingProject.description} onChange={(v: string) => setEditingProject({...editingProject, description: v})} />
              <div className="grid grid-cols-2 gap-8">
                <Input label="TECHNICAL DEPTH" value={editingProject.technicalDepth} onChange={(v: string) => setEditingProject({...editingProject, technicalDepth: v})} />
                <Input label="SCALE & IMPACT" value={editingProject.scaleImpact} onChange={(v: string) => setEditingProject({...editingProject, scaleImpact: v})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleSaveProject} 
                  disabled={isSaving}
                  className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest disabled:opacity-50 shadow-lg hover:opacity-90 transition-opacity"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditingProject(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-colors">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ExperienceTab({ items, refresh, showToast, isSaving, setIsSaving, requestConfirm }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveExperience(editingItem);
      showToast("Experience saved!");
      setEditingItem(null);
      refresh();
    } catch (e) {
      showToast("Failed to save experience", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="font-label-caps text-secondary mb-2">RESUME</p>
          <h2 className="font-display-xl text-5xl">Experience</h2>
        </div>
        <button 
          onClick={() => setEditingItem({ id: Date.now().toString(), title: '', company: '', period: '', highlights: [''], order: items.length })}
          className="bg-primary text-on-primary px-8 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
        >
          <span className="material-symbols-outlined">add</span>
          Add Experience
        </button>
      </div>

      <div className="grid gap-6">
        {items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any) => (
          <div key={item.id} className="bg-surface-container-lowest border border-outline-variant p-8 flex justify-between items-start group hover:border-primary transition-colors">
            <div>
              <p className="font-label-caps text-[10px] text-secondary mb-2">{item.company} — {item.period}</p>
              <h3 className="font-headline-md text-xl mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(item)} className="p-3 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button onClick={() => deleteItem('experience', item.id, refresh, showToast, requestConfirm)} className="p-3 hover:bg-error-container rounded-full transition-colors text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingItem && (
          <Modal onClose={() => setEditingItem(null)}>
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="font-display-xl text-3xl">Edit Career History</h3>
                <button onClick={() => setEditingItem(null)} className="material-symbols-outlined">close</button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Input label="ROLE TITLE" value={editingItem.title} onChange={(v: string) => setEditingItem({...editingItem, title: v})} />
                <Input label="COMPANY" value={editingItem.company} onChange={(v: string) => setEditingItem({...editingItem, company: v})} />
              </div>
              <Input label="PERIOD" value={editingItem.period} onChange={(v: string) => setEditingItem({...editingItem, period: v})} />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase">Key Highlights</label>
                  <button onClick={() => setEditingItem({...editingItem, highlights: [...editingItem.highlights, '']})} className="text-primary font-label-caps text-[9px] uppercase tracking-widest">+ Add Bullet</button>
                </div>
                {editingItem.highlights.map((h: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <input 
                      className="flex-1 bg-surface-container-low border border-outline-variant p-4 font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
                      value={h}
                      onChange={(e) => {
                        const newH = [...editingItem.highlights];
                        newH[i] = e.target.value;
                        setEditingItem({...editingItem, highlights: newH});
                      }}
                    />
                    <button onClick={() => {
                      const newH = editingItem.highlights.filter((_: any, idx: number) => idx !== i);
                      setEditingItem({...editingItem, highlights: newH});
                    }} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">delete</button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest disabled:opacity-50 shadow-lg hover:opacity-90 transition-opacity"
                >
                  {isSaving ? 'Saving...' : 'Save Role'}
                </button>
                <button onClick={() => setEditingItem(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-colors">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkillsTab({ items, refresh, showToast, isSaving, setIsSaving, requestConfirm }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSaveSkill = async () => {
    setIsSaving(true);
    try {
      await saveSkill(editingItem);
      showToast("Skills updated!");
      setEditingItem(null);
      refresh();
    } catch (e) {
      showToast("Failed to save skills.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <p className="font-label-caps text-secondary mb-2">TECHNICAL DEPTH</p>
          <h2 className="font-display-xl text-5xl">Skills</h2>
        </div>
        <button 
          onClick={() => setEditingItem({ id: Date.now().toString(), title: "", skills: "", order: items.length })}
          className="bg-primary text-on-primary px-6 py-3 rounded font-label-caps text-[10px] tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span> ADD SKILL GROUP
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-surface-container-lowest border border-outline-variant p-6 flex justify-between items-center group hover:border-primary transition-colors">
            <div>
              <h3 className="font-headline-md text-xl font-bold">{item.title}</h3>
              <p className="font-body-md text-sm text-on-surface-variant truncate max-w-xl">{item.skills}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(item)} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full text-lg">edit</button>
              <button onClick={() => deleteItem("skills", item.id, refresh, showToast, requestConfirm)} className="material-symbols-outlined text-error p-2 hover:bg-error-container rounded-full text-lg">delete</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingItem && (
          <Modal onClose={() => setEditingItem(null)}>
            <div className="p-10 space-y-8">
              <h3 className="font-display-xl text-3xl">Edit Skill Group</h3>
              <Input label="GROUP TITLE" value={editingItem.title} onChange={(v: string) => setEditingItem({...editingItem, title: v})} />
              <Textarea label="SKILLS (COMMA SEPARATED)" value={editingItem.skills} onChange={(v: string) => setEditingItem({...editingItem, skills: v})} />
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleSaveSkill} 
                  disabled={isSaving}
                  className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest disabled:opacity-50 shadow-lg hover:opacity-90 transition-opacity"
                >
                  {isSaving ? 'Saving...' : 'Save Group'}
                </button>
                <button onClick={() => setEditingItem(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-colors">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EducationTab({ items, refresh, showToast, isSaving, setIsSaving, requestConfirm }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveEducation(editingItem);
      showToast("Education saved!");
      setEditingItem(null);
      refresh();
    } catch (e) {
      showToast("Failed to save education", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="font-label-caps text-secondary mb-2">ACADEMIC</p>
          <h2 className="font-display-xl text-5xl">Education</h2>
        </div>
        <button 
          onClick={() => setEditingItem({ id: Date.now().toString(), degree: '', institution: '', period: '', order: items.length })}
          className="bg-primary text-on-primary px-8 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
        >
          <span className="material-symbols-outlined">add</span>
          Add Education
        </button>
      </div>

      <div className="grid gap-6">
        {items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any) => (
          <div key={item.id} className="bg-surface-container-lowest border border-outline-variant p-8 flex justify-between items-start group hover:border-primary transition-colors">
            <div>
              <p className="font-label-caps text-[10px] text-secondary mb-2">{item.institution} — {item.period}</p>
              <h3 className="font-headline-md text-xl mb-2 group-hover:text-primary transition-colors">{item.degree}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(item)} className="p-3 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button onClick={() => deleteItem('education', item.id, refresh, showToast, requestConfirm)} className="p-3 hover:bg-error-container rounded-full transition-colors text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingItem && (
          <Modal onClose={() => setEditingItem(null)}>
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="font-display-xl text-3xl">Edit Education</h3>
                <button onClick={() => setEditingItem(null)} className="material-symbols-outlined">close</button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Input label="DEGREE / CERTIFICATION" value={editingItem.degree} onChange={(v: string) => setEditingItem({...editingItem, degree: v})} />
                <Input label="INSTITUTION" value={editingItem.institution} onChange={(v: string) => setEditingItem({...editingItem, institution: v})} />
              </div>
              <Input label="PERIOD" value={editingItem.period} onChange={(v: string) => setEditingItem({...editingItem, period: v})} />
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest disabled:opacity-50 shadow-lg hover:opacity-90 transition-opacity"
                >
                  {isSaving ? 'Saving...' : 'Save Education'}
                </button>
                <button onClick={() => setEditingItem(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-colors">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsTab({ content, refresh, showToast, isSaving, setIsSaving, requestConfirm }: any) {
  const handleSyncHiringSignals = async () => {
    setIsSaving(true);
    try {
      // 1. Hero & Profile Content
      const newContent: SiteContent = {
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
      await saveSiteContent(newContent);

      // 2. Experience Highlights (using saveExperience)
      // Grouping: top 3 are featured, others are foundations
      const experiences: ExperienceItem[] = [
        {
          id: "exp1",
          period: "2022 – Present",
          title: "Senior Backend Engineer",
          company: "PT Telkom Indonesia",
          highlights: [
            "Led backend development for national operational workflow platforms (OSS) using Node.js, NestJS, PostgreSQL, Redis, and GitLab CI/CD.",
            "Designed API contracts, data models, service boundaries, and release workflows for submission, review, and integration systems.",
            "Improved delivery consistency through code reviews, documentation, standardizing CI/CD pipelines, and mentoring junior engineers.",
            "Collaborated with cross-functional stakeholders to translate complex operational requirements into production-ready systems."
          ],
          order: 0
        },
        {
          id: "exp2",
          period: "2020 – 2022",
          title: "Backend Engineer",
          company: "PT Telkom Indonesia",
          highlights: [
            "Maintained and optimized high-traffic mobile APIs for national telecom products, ensuring production reliability and performance.",
            "Implemented real-time data ingestion and monitoring systems using Elasticsearch and Node.js for large-volume media record processing.",
            "Automated deployment workflows using Docker and Nginx, reducing manual release risks across multiple environments."
          ],
          order: 1
        },
        {
          id: "exp3",
          period: "2019 – 2020",
          title: "Web Engineer",
          company: "Various Platforms (Hungry/Other, G-Meds)",
          highlights: [
            "Delivered core backend features for pharmaceutical and document management systems within distributed international teams.",
            "Developed responsive administrative dashboards and integrated secure APIs to improve operational visibility for clinic partners."
          ],
          order: 2
        },
        {
          id: "exp4",
          period: "2018 – 2019",
          title: "Full-Stack Web Developer",
          company: "Internal Dashboard Tools",
          highlights: ["Earlier web engineering roles across backend, frontend, CodeIgniter, Laravel, MySQL, and production support."],
          order: 3
        }
      ];
      for (const exp of experiences) await saveExperience(exp);

      // 3. Projects (using saveProject) - Ensure UNIQUE
      const projects: Project[] = [
        {
          id: "proj1",
          company: "PT Telkom Indonesia",
          period: "2022 – Present",
          title: "Online Single Submission (OSS)",
          result: "Led backend delivery for a national licensing workflow with review visibility, role-based approvals, and CI/CD release discipline.",
          description: "Designed API contracts, service boundaries, PostgreSQL data models, Redis-backed workflows, and deployment pipelines for operational stakeholders.",
          technicalDepth: "Node.js, NestJS, PostgreSQL, Redis, GitLab CI/CD, Microservices",
          scaleImpact: "Impact: Improved review traceability, reduced manual coordination, and established production release consistency for a national-scale platform.",
          status: "Featured Case Study",
          order: 0
        },
        {
          id: "proj2",
          company: "PT Telkom Indonesia",
          period: "2021 – 2022",
          title: "MyTelkomsel Mobile App APIs",
          result: "Maintained and improved production mobile APIs for a national telecom product with millions of active users.",
          description: "Optimized API response times and improved error handling for high-volume mobile traffic during a major service transition.",
          technicalDepth: "Node.js, Express.js, MySQL, Redis, Nginx, API Optimization",
          scaleImpact: "Impact: Improved API maintainability, deployment consistency, and migration readiness for high-pressure mobile service teams.",
          status: "Case study available",
          order: 1
        },
        {
          id: "proj3",
          company: "PT Telkom Indonesia",
          period: "2020 – 2021",
          title: "Media Monitoring System",
          result: "Delivered a monitoring backend and dashboard for operational media review, handling large-volume data workflows.",
          description: "Built the ingestion pipeline and administrative dashboard to monitor media sentiment and processing status in real-time.",
          technicalDepth: "Node.js, Vue.js, PostgreSQL, Elasticsearch, Real-time Ingestion",
          scaleImpact: "Impact: Improved visibility across monitoring workflows and reduced dependency on manual report checking for enterprise teams.",
          status: "Case study available",
          order: 2
        },
        {
          id: "proj4",
          company: "Freelance / Early Career",
          period: "2018 – 2019",
          title: "G-Meds Health Platform",
          result: "Developed core backend features for pharmaceutical procurement and distribution systems with distributed international teams.",
          description: "Implemented inventory management, order processing, and supplier integration APIs to digitize clinical supply chains.",
          technicalDepth: "Node.js, Express, MySQL, REST APIs, Documentation",
          scaleImpact: "Impact: Digitized manual pharmaceutical workflows, improving order accuracy and inventory visibility for clinic partners.",
          status: "Archive case study",
          order: 3
        }
      ];
      for (const proj of projects) await saveProject(proj);

      showToast("Database synchronized with refined signals!");
      refresh();
    } catch (e) {
      console.error(e);
      showToast("Sync failed. Check database permissions.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12">
        <p className="font-label-caps text-secondary mb-2">PREFERENCES</p>
        <h2 className="font-display-xl text-5xl">Settings</h2>
      </div>
      
      <div className="grid gap-8 max-w-4xl">
        <div className="bg-surface-container-lowest border border-outline-variant p-10">
          <h3 className="font-headline-md text-xl mb-6">Database Migration Utility</h3>
          <p className="font-body-md text-on-surface-variant mb-8 text-sm leading-relaxed">
            Use this tool to permanently synchronize the new high-impact hiring signals (Senior Backend positioning, sharpened results, and evidence density) to your Firestore database.
          </p>
          <button 
            onClick={() => requestConfirm(
              "Sync Hiring Signals?",
              "This will synchronize the new high-impact hiring signals (Senior Backend positioning, refined results, and sharpened technical depth) to your Firestore database. Existing data will be merged.",
              handleSyncHiringSignals,
              "Confirm Sync"
            )} 
            disabled={isSaving}
            className="w-full bg-secondary text-on-secondary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{isSaving ? 'sync' : 'database'}</span>
            {isSaving ? 'Synchronizing...' : 'Sync All Hiring Signals to Firestore'}
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-10">
          <h3 className="font-headline-md text-xl mb-6">General Configuration</h3>
          <p className="font-body-md text-on-surface-variant mb-10 text-sm">Update your administrative credentials and site visibility settings here.</p>
          <button onClick={() => showToast("Password reset link sent to your email.")} className="w-full border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">Change Admin Password</button>
        </div>
      </div>
    </motion.div>
  );
}

function ConfirmationModal({ title, message, onConfirm, onClose, confirmLabel = "Confirm" }: any) {
  return (
    <Modal onClose={onClose}>
      <div className="p-10 space-y-6">
        <h3 className="font-display-xl text-3xl">{title}</h3>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {message}
        </p>
        <div className="flex gap-4 pt-4">
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity"
          >
            {confirmLabel}
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// --- HELPERS ---

function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/70 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        className="relative bg-surface-container-lowest border border-outline-variant w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="font-label-caps text-[9px] text-on-surface-variant tracking-widest uppercase">{label}</label>
      <input 
        className="w-full bg-surface-container-low border border-outline-variant p-4 font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="font-label-caps text-[9px] text-on-surface-variant tracking-widest uppercase">{label}</label>
      <textarea 
        className="w-full bg-surface-container-low border border-outline-variant p-4 font-body-md text-sm focus:outline-none focus:border-primary transition-colors min-h-[160px] resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
