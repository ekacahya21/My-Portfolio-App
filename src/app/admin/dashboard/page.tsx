"use client";

import "../../admin.css";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

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

  const handleLogout = () => {
    if (auth) signOut(auth).then(() => router.push("/admin/login"));
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
          <SidebarLink icon="dashboard" label="Dashboard" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <SidebarLink icon="view_quilt" label="Hero Section" active={activeTab === "hero"} onClick={() => setActiveTab("hero")} />
          <SidebarLink icon="account_circle" label="Profile & Bio" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <SidebarLink icon="work_history" label="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
          <SidebarLink icon="description" label="Experience" active={activeTab === "experience"} onClick={() => setActiveTab("experience")} />
          <SidebarLink icon="psychology" label="Skills" active={activeTab === "skills"} onClick={() => setActiveTab("skills")} />
          <SidebarLink icon="school" label="Education" active={activeTab === "education"} onClick={() => setActiveTab("education")} />
        </nav>

        {/* CTA & Footer */}
        <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant">
          <Link href="/" target="_blank" className="w-full bg-primary text-on-primary py-3 px-4 rounded font-label-caps text-[10px] text-center uppercase tracking-widest hover:opacity-90 transition-opacity block">
            Preview Portfolio
          </Link>
          <div className="space-y-1">
            <button onClick={() => setActiveTab("settings")} className={`flex items-center w-full gap-3 px-4 py-2 rounded transition-colors ${activeTab === 'settings' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
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

        {/* Main Canvas */}
        <main className="p-10 flex-1 bg-background">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab key="overview" data={data} setTab={setActiveTab} />}
            {activeTab === "hero" && <HeroTab key="hero" content={data.content} refresh={fetchAllData} showToast={showToast} />}
            {activeTab === "profile" && <ProfileTab key="profile" content={data.content} refresh={fetchAllData} showToast={showToast} />}
            {activeTab === "projects" && <ProjectsTab key="projects" items={data.projects} refresh={fetchAllData} showToast={showToast} />}
            {activeTab === "experience" && <ExperienceTab key="experience" items={data.experience} refresh={fetchAllData} showToast={showToast} />}
            {activeTab === "skills" && <SkillsTab key="skills" items={data.skills} refresh={fetchAllData} showToast={showToast} />}
            {activeTab === "education" && <EducationTab key="education" items={data.education} refresh={fetchAllData} showToast={showToast} />}
            {activeTab === "settings" && <SettingsTab key="settings" content={data.content} refresh={fetchAllData} showToast={showToast} />}
          </AnimatePresence>

          {/* Footer Info */}
          <footer className="mt-20 border-t border-outline-variant pt-8 pb-8 flex justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant">PORTFOLIO CMS V3.0.0 — MODERN EDITORIAL ENGINE</p>
            <div className="flex gap-8">
              <a className="font-label-caps text-[10px] hover:text-primary transition-colors" href="#">DOCUMENTATION</a>
              <a className="font-label-caps text-[10px] hover:text-primary transition-colors" href="#">SYSTEM STATUS</a>
            </div>
          </footer>
        </main>
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

function HeroTab({ content, refresh, showToast }: any) {
  const [form, setForm] = useState(content || { heroTitle: "", heroCopy: "" });

  const handleSave = async () => {
    await saveSiteContent(form);
    showToast("Hero section updated successfully!");
    refresh();
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
          <button onClick={handleSave} className="bg-primary text-on-primary px-10 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">save</span>
            Publish Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileTab({ content, refresh, showToast }: any) {
  const [form, setForm] = useState(content || { introTitle: "", introCopy: "", email: "", github: "", linkedin: "", avatarUrl: "", profileUrl: "" });

  const handleSave = async () => {
    await saveSiteContent(form);
    showToast("Profile information saved!");
    refresh();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12">
        <p className="font-label-caps text-secondary mb-2">CONTENT EDITOR</p>
        <h2 className="font-display-xl text-5xl">Profile & Bio</h2>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant p-10 space-y-10 max-w-4xl">
        <div className="grid grid-cols-2 gap-8">
          <Input label="EMAIL ADDRESS" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="AVATAR URL" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />
          <Input label="GITHUB URL" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
          <Input label="LINKEDIN URL" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
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
          <button onClick={handleSave} className="bg-primary text-on-primary px-10 py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">save</span>
            Save Biography
          </button>
        </div>
      </div>
    </motion.div>
  );
}

async function deleteItem(collectionName: string, id: string, refresh: () => void, showToast: (m: string) => void) {
  if (confirm("Are you sure you want to delete this item?")) {
    await deleteDoc(doc(db, collectionName, id));
    showToast("Item deleted successfully.");
    refresh();
  }
}

function ProjectsTab({ items, refresh, showToast }: any) {
  const [editingProject, setEditingProject] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <p className="font-label-caps text-secondary mb-2">CONTENT LIBRARY</p>
          <h2 className="font-display-xl text-5xl">Projects</h2>
        </div>
        <button 
          onClick={() => setEditingProject({ id: Date.now().toString(), title: "", company: "", period: "", description: "", result: "", technicalDepth: "", scaleImpact: "", order: items.length })}
          className="bg-primary text-on-primary px-6 py-3 rounded font-label-caps text-[10px] tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span> ADD NEW PROJECT
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((project: any) => (
          <div key={project.id} className="bg-surface-container-lowest border border-outline-variant p-6 flex justify-between items-center group hover:border-primary transition-colors">
            <div>
              <p className="font-label-caps text-[9px] text-secondary tracking-widest uppercase mb-1">{project.period}</p>
              <h3 className="font-headline-md text-xl font-bold">{project.title}</h3>
              <p className="font-body-md text-sm text-on-surface-variant">{project.company}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProject(project)} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full text-lg">edit</button>
              <button onClick={() => deleteItem("projects", project.id, refresh, showToast)} className="material-symbols-outlined text-error p-2 hover:bg-error-container rounded-full text-lg">delete</button>
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
              <div className="flex gap-4 pt-6">
                <button onClick={async () => { await saveProject(editingProject); showToast("Project saved!"); setEditingProject(null); refresh(); }} className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Save Changes</button>
                <button onClick={() => setEditingProject(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ExperienceTab({ items, refresh, showToast }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <p className="font-label-caps text-secondary mb-2">CAREER LOG</p>
          <h2 className="font-display-xl text-5xl">Experience</h2>
        </div>
        <button 
          onClick={() => setEditingItem({ id: Date.now().toString(), title: "", company: "", period: "", highlights: [], order: items.length })}
          className="bg-primary text-on-primary px-6 py-3 rounded font-label-caps text-[10px] tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span> ADD NEW ROLE
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-surface-container-lowest border border-outline-variant p-6 flex justify-between items-center group hover:border-primary transition-colors">
            <div>
              <p className="font-label-caps text-[9px] text-secondary tracking-widest uppercase mb-1">{item.period}</p>
              <h3 className="font-headline-md text-xl font-bold">{item.title}</h3>
              <p className="font-body-md text-sm text-on-surface-variant">{item.company}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(item)} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full text-lg">edit</button>
              <button onClick={() => deleteItem("experience", item.id, refresh, showToast)} className="material-symbols-outlined text-error p-2 hover:bg-error-container rounded-full text-lg">delete</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingItem && (
          <Modal onClose={() => setEditingItem(null)}>
            <div className="p-10 space-y-8">
              <h3 className="font-display-xl text-3xl">Edit Career History</h3>
              <div className="grid grid-cols-2 gap-8">
                <Input label="ROLE TITLE" value={editingItem.title} onChange={(v: string) => setEditingItem({...editingItem, title: v})} />
                <Input label="COMPANY" value={editingItem.company} onChange={(v: string) => setEditingItem({...editingItem, company: v})} />
              </div>
              <Input label="PERIOD" value={editingItem.period} onChange={(v: string) => setEditingItem({...editingItem, period: v})} />
              <div className="flex gap-4 pt-6">
                <button onClick={async () => { await saveExperience(editingItem); showToast("Experience saved!"); setEditingItem(null); refresh(); }} className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Save Role</button>
                <button onClick={() => setEditingItem(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkillsTab({ items, refresh, showToast }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

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
              <button onClick={() => deleteItem("skills", item.id, refresh, showToast)} className="material-symbols-outlined text-error p-2 hover:bg-error-container rounded-full text-lg">delete</button>
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
                <button onClick={async () => { await saveSkill(editingItem); showToast("Skills updated!"); setEditingItem(null); refresh(); }} className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Save Group</button>
                <button onClick={() => setEditingItem(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EducationTab({ items, refresh, showToast }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <p className="font-label-caps text-secondary mb-2">ACADEMIC RECORD</p>
          <h2 className="font-display-xl text-5xl">Education</h2>
        </div>
        <button 
          onClick={() => setEditingItem({ id: Date.now().toString(), degree: "", institution: "", period: "", order: items.length })}
          className="bg-primary text-on-primary px-6 py-3 rounded font-label-caps text-[10px] tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span> ADD EDUCATION
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-surface-container-lowest border border-outline-variant p-6 flex justify-between items-center group hover:border-primary transition-colors">
            <div>
              <p className="font-label-caps text-[9px] text-secondary tracking-widest uppercase mb-1">{item.period}</p>
              <h3 className="font-headline-md text-xl font-bold">{item.degree}</h3>
              <p className="font-body-md text-sm text-on-surface-variant">{item.institution}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(item)} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full text-lg">edit</button>
              <button onClick={() => deleteItem("education", item.id, refresh, showToast)} className="material-symbols-outlined text-error p-2 hover:bg-error-container rounded-full text-lg">delete</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingItem && (
          <Modal onClose={() => setEditingItem(null)}>
            <div className="p-10 space-y-8">
              <h3 className="font-display-xl text-3xl">Edit Education</h3>
              <div className="grid grid-cols-2 gap-8">
                <Input label="DEGREE / CERTIFICATION" value={editingItem.degree} onChange={(v: string) => setEditingItem({...editingItem, degree: v})} />
                <Input label="INSTITUTION" value={editingItem.institution} onChange={(v: string) => setEditingItem({...editingItem, institution: v})} />
              </div>
              <Input label="PERIOD" value={editingItem.period} onChange={(v: string) => setEditingItem({...editingItem, period: v})} />
              <div className="flex gap-4 pt-6">
                <button onClick={async () => { await saveEducation(editingItem); showToast("Education saved!"); setEditingItem(null); refresh(); }} className="flex-1 bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Save Education</button>
                <button onClick={() => setEditingItem(null)} className="flex-1 border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsTab({ content, refresh, showToast }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12">
        <p className="font-label-caps text-secondary mb-2">PREFERENCES</p>
        <h2 className="font-display-xl text-5xl">Settings</h2>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant p-10 max-w-2xl">
        <h3 className="font-headline-md text-xl mb-6">General Configuration</h3>
        <p className="font-body-md text-on-surface-variant mb-10 text-sm">Update your administrative credentials and site visibility settings here.</p>
        <button onClick={() => showToast("Password reset link sent to your email.")} className="w-full border border-outline-variant py-4 rounded font-label-caps text-[11px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">Change Admin Password</button>
      </div>
    </motion.div>
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
