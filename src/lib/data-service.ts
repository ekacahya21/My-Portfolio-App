import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";

export interface Project {
  id: string;
  company: string;
  period: string;
  title: string;
  result: string;
  description: string;
  technicalDepth: string;
  scaleImpact: string;
  caseStudyUrl?: string;
  status?: string;
  order: number;
}

export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  company: string;
  highlights: string[];
  order: number;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string;
  order: number;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description?: string;
  order: number;
}

// Projects
export async function getProjects() {
  if (!db) return [];
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function saveProject(project: Project) {
  if (!db) return;
  const docRef = doc(db, "projects", project.id);
  await setDoc(docRef, project, { merge: true });
}

// Experience
export async function getExperience() {
  if (!db) return [];
  const q = query(collection(db, "experience"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExperienceItem));
}

export async function saveExperience(item: ExperienceItem) {
  if (!db) return;
  const docRef = doc(db, "experience", item.id);
  await setDoc(docRef, item, { merge: true });
}

// Skills
export async function getSkills() {
  if (!db) return [];
  const q = query(collection(db, "skills"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillGroup));
}

export async function saveSkill(skill: SkillGroup) {
  if (!db) return;
  const docRef = doc(db, "skills", skill.id);
  await setDoc(docRef, skill, { merge: true });
}

// Education
export async function getEducation() {
  if (!db) return [];
  const q = query(collection(db, "education"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EducationItem));
}

export async function saveEducation(item: EducationItem) {
  if (!db) return;
  const docRef = doc(db, "education", item.id);
  await setDoc(docRef, item, { merge: true });
}

// Decisions
export interface Decision {
  id: string;
  title: string;
  description: string;
  example: string;
  order: number;
}

export async function getDecisions() {
  if (!db) return [];
  const q = query(collection(db, "decisions"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Decision));
}

export async function saveDecision(decision: Decision) {
  if (!db) return;
  const docRef = doc(db, "decisions", decision.id);
  await setDoc(docRef, decision, { merge: true });
}

// Profile/Hero Content
export interface SiteContent {
  heroTitle?: string;
  heroCopy?: string;
  introTitle?: string;
  introCopy?: string;
  availability?: string[];
  email?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  avatarUrl?: string;
  profileUrl?: string;
}

export async function getSiteContent() {
  if (!db) return null;
  const docRef = doc(db, "settings", "content");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as SiteContent : null;
}

export async function saveSiteContent(content: SiteContent) {
  if (!db) return;
  const docRef = doc(db, "settings", "content");
  await setDoc(docRef, content, { merge: true });
}
