import { 
  collection, doc, getDocs, setDoc, deleteDoc, updateDoc,
  onSnapshot, query, Firestore, getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, Testimonial, Client, VideoTestimonial } from "../types";

// Firebase Collections Helper
const collections = {
  projects: collection(db, 'projects'),
  testimonials: collection(db, 'testimonials'),
  clients: collection(db, 'clients'),
  videoTestimonials: collection(db, 'videoTestimonials'),
  teamMembers: collection(db, 'teamMembers'),
  applications: collection(db, 'applications'),
  consultations: collection(db, 'consultations'),
  activities: collection(db, 'activities'),
};

// --- Projects ---
export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  const q = query(collections.projects);
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    callback(projects);
  });
};

export async function fetchLocalProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collections.projects);
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return projects;
}

export async function saveLocalProject(project: Omit<Project, 'id'>) {
  const newRef = doc(collections.projects);
  const newProj = { ...project, id: newRef.id };
  await setDoc(newRef, newProj);
  await logAdminActivity(`Created new portfolio project "${newProj.title}"`, "Admin");
  return newProj;
}

export async function updateLocalProject(project: Project) {
  const docRef = doc(collections.projects, project.id);
  await updateDoc(docRef, { ...project });
  await logAdminActivity(`Updated portfolio project "${project.title}"`, "Admin");
}

export async function deleteLocalProject(id: string) {
  const docRef = doc(collections.projects, id);
  await deleteDoc(docRef);
  await logAdminActivity(`Deleted a portfolio project`, "Admin");
}

export async function updateAllProjectsOrder(projects: Project[]) {
  const promises = projects.map((p, index) => {
    const docRef = doc(collections.projects, p.id);
    return updateDoc(docRef, { order: index });
  });
  await Promise.all(promises);
}

export async function updateLocalProjectHighlights(selectedIds: string[]) {
  const snapshot = await getDocs(collections.projects);
  const promises = snapshot.docs.map(d => {
    const docRef = d.ref;
    return updateDoc(docRef, { isHighlight: selectedIds.includes(d.id) });
  });
  await Promise.all(promises);
  return []; // Return type not strictly used in current implementation
}

// --- Testimonials ---
export async function fetchLocalTestimonials(): Promise<Testimonial[]> {
  const snapshot = await getDocs(collections.testimonials);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}

export async function saveLocalTestimonial(testimonial: Omit<Testimonial, 'id'>) {
  const newRef = doc(collections.testimonials);
  const data = { ...testimonial, id: newRef.id };
  await setDoc(newRef, data);
  return data;
}

export async function deleteLocalTestimonial(id: string) {
  await deleteDoc(doc(collections.testimonials, id));
}

// --- Clients ---
export async function fetchLocalClients(): Promise<Client[]> {
  const snapshot = await getDocs(collections.clients);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}

export async function saveLocalClient(client: Omit<Client, 'id'>) {
  const newRef = doc(collections.clients);
  const data = { ...client, id: newRef.id };
  await setDoc(newRef, data);
  return data;
}

export async function deleteLocalClient(id: string) {
  await deleteDoc(doc(collections.clients, id));
}

// --- Video Testimonials ---
export async function fetchLocalVideoTestimonials(): Promise<VideoTestimonial[]> {
  const snapshot = await getDocs(collections.videoTestimonials);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoTestimonial));
}

export async function saveLocalVideoTestimonial(vt: Omit<VideoTestimonial, 'id'>) {
  const newRef = doc(collections.videoTestimonials);
  const data = { ...vt, id: newRef.id };
  await setDoc(newRef, data);
  return data;
}

export async function deleteLocalVideoTestimonial(id: string) {
  await deleteDoc(doc(collections.videoTestimonials, id));
}

// --- Team ---
export async function fetchLocalTeam(): Promise<any[]> {
  const snapshot = await getDocs(collections.teamMembers);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveLocalTeamMember(member: any) {
  const newRef = doc(collections.teamMembers);
  const data = { ...member, id: newRef.id };
  await setDoc(newRef, data);
  return data;
}

export async function updateLocalTeamMember(member: any) {
  await updateDoc(doc(collections.teamMembers, member.id), { ...member });
}

export async function deleteLocalTeamMember(id: string) {
  await deleteDoc(doc(collections.teamMembers, id));
}

// --- Submissions ---
export async function saveLocalApplication(appData: any) {
  const newRef = doc(collections.applications);
  const data = {
    ...appData,
    id: newRef.id,
    status: "New",
    submittedAt: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };
  await setDoc(newRef, data);
  return data;
}

export async function saveLocalConsultation(consultationData: any) {
  const newRef = doc(collections.consultations);
  const data = {
    ...consultationData,
    id: newRef.id,
    status: "New",
    submittedAt: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };
  await setDoc(newRef, data);
  return data;
}

export const subscribeToSubmissions = (callback: (data: { applications: any[], consultations: any[] }) => void) => {
  const appQuery = query(collections.applications);
  const consQuery = query(collections.consultations);

  let applications: any[] = [];
  let consultations: any[] = [];
  
  let appsLoaded = false;
  let consLoaded = false;

  const unsubApps = onSnapshot(appQuery, (snapshot) => {
    applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    appsLoaded = true;
    if (appsLoaded && consLoaded) callback({ applications, consultations });
  });

  const unsubCons = onSnapshot(consQuery, (snapshot) => {
    consultations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    consLoaded = true;
    if (appsLoaded && consLoaded) callback({ applications, consultations });
  });

  return () => {
    unsubApps();
    unsubCons();
  };
};

export async function fetchLocalSubmissions() {
  const [appSnapshot, consSnapshot] = await Promise.all([
    getDocs(collections.applications),
    getDocs(collections.consultations)
  ]);
  const applications = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const consultations = consSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return { applications, consultations };
}

export async function updateLocalSubmissionStatus(id: string, type: 'application' | 'consultation', newStatus: string) {
  const colRef = type === 'application' ? collections.applications : collections.consultations;
  await updateDoc(doc(colRef, id), { status: newStatus });
  await logAdminActivity(`Updated ${type} status to ${newStatus}`, "Admin");
}

export async function deleteLocalSubmission(id: string, type: 'application' | 'consultation') {
  const colRef = type === 'application' ? collections.applications : collections.consultations;
  await deleteDoc(doc(colRef, id));
  await logAdminActivity(`Deleted ${type}`, "Admin");
}

export async function bulkUpdateLocalStatus(type: 'application' | 'consultation', ids: string[], newStatus: string) {
  const colRef = type === 'application' ? collections.applications : collections.consultations;
  const promises = ids.map(id => updateDoc(doc(colRef, id), { status: newStatus }));
  await Promise.all(promises);
  await logAdminActivity(`Bulk updated ${ids.length} ${type}s to ${newStatus}`, "Admin");
}

export async function bulkDeleteLocalSubmissions(type: 'application' | 'consultation', ids: string[]) {
  const colRef = type === 'application' ? collections.applications : collections.consultations;
  const promises = ids.map(id => deleteDoc(doc(colRef, id)));
  await Promise.all(promises);
  await logAdminActivity(`Bulk deleted ${ids.length} ${type}s`, "Admin");
}

// --- Activities ---
export async function logAdminActivity(action: string, adminName: string) {
  const newRef = doc(collections.activities);
  await setDoc(newRef, {
    id: newRef.id,
    action,
    timestamp: new Date().toISOString(),
    adminName
  });
}

export const subscribeToActivities = (callback: (activities: any[]) => void) => {
  const q = query(collections.activities);
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(activities);
  });
};

export async function fetchLocalActivities() {
  const snapshot = await getDocs(collections.activities);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
     .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
