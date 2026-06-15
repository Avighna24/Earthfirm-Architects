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
    callback(projects);
  });
};

export async function fetchLocalProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collections.projects);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function saveLocalProject(project: Omit<Project, 'id'>) {
  const newRef = doc(collections.projects);
  const newProj = { ...project, id: newRef.id };
  await setDoc(newRef, newProj);
  return newProj;
}

export async function updateLocalProject(project: Project) {
  const docRef = doc(collections.projects, project.id);
  await updateDoc(docRef, { ...project });
}

export async function deleteLocalProject(id: string) {
  const docRef = doc(collections.projects, id);
  await deleteDoc(docRef);
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
