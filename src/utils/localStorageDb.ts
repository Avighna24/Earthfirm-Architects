// IndexedDB & Local Storage Database for Earthfirm Architects
import { Project, Testimonial, Client, VideoTestimonial } from "../types";
import { PROJECTS, TESTIMONIALS, CLIENTS, VIDEO_TESTIMONIALS } from '../data';

const DEFAULT_TEAM = [
  { id: "tm1", name: "Ar. Harshvardhan Bhawra", title: "Principal Design Architect & Biophilic Lead", role: "Principal Design Architect", bio: "Drafting microclimatic architecture and living spaces.", avatar: "" },
  { id: "tm2", name: "Er. Amit Sharma", title: "Principal Structural Engineer", role: "Principal Structural Engineer", bio: "Ensuring long-lasting stability with tectonic structural systems.", avatar: "" },
  { id: "tm3", name: "Prachi J.", title: "Landscape Architect & Ecological Specialist", role: "Landscape Architect", bio: "Integrating pristine native outdoor landscapes.", avatar: "" }
];

const KEYS = {
  PROJECTS: "earthfirm_projects_list",
  TESTIMONIALS: "earthfirm_testimonials_list",
  PARTNERS: "earthfirm_partners_list",
  VIDEO_TESTIMONIALS: "earthfirm_videotests_list",
  TEAM: "earthfirm_team_list",
  ACTIVITIES: "earthfirm_activities_list",
  APPLICATIONS: "earthfirm_applications_list",
  CONSULTATIONS: "earthfirm_consultations_list"
};

const DB_NAME = "earthfirm_architects_db";
const STORE_NAME = "key_value_store";
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStored<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await getDB();
    
    // First, check if there is an existing localStorage item to migrate
    let migratedData: T | null = null;
    try {
      const localData = localStorage.getItem(key);
      if (localData !== null) {
        migratedData = JSON.parse(localData);
      }
    } catch (_) {}

    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = async () => {
        if (request.result === undefined) {
          // No entry in IndexedDB
          if (migratedData !== null) {
            // Found data in localStorage to migrate! Save it and clean up localStorage.
            await setStored(key, migratedData);
            try {
              localStorage.removeItem(key);
            } catch (_) {}
            resolve(migratedData);
          } else {
            // Write default value
            await setStored(key, defaultValue);
            resolve(defaultValue);
          }
        } else {
          // If we found data in IndexedDB but also have leftovers in localStorage, clean it up
          if (migratedData !== null) {
            try {
              localStorage.removeItem(key);
            } catch (_) {}
          }
          resolve(request.result as T);
        }
      };
      
      request.onerror = () => {
        resolve(migratedData !== null ? migratedData : defaultValue);
      };
    });
  } catch (e) {
    // Fallback to localStorage if IndexedDB is blocked
    try {
      const localData = localStorage.getItem(key);
      if (localData) return JSON.parse(localData);
    } catch (_) {}
    return defaultValue;
  }
}

async function setStored<T>(key: string, data: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    // Fallback to localStorage
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_) {}
  }
}

// 1. Subscribe to projects (realtime simulation)
export const subscribeToProjects = (callback: (projects: Project[]) => void) => {
  const handler = () => {
    fetchLocalProjects().then(callback);
  };
  window.addEventListener("earthfirm_portfolio_updated", handler);
  handler();
  return () => {
    window.removeEventListener("earthfirm_portfolio_updated", handler);
  };
};

// 2. Projects
export function compressBase64(base64Str: string, maxDim: number = 900, quality: number = 0.7): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith("data:image/") || base64Str.length < 100000) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h *= maxDim / w;
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w *= maxDim / h;
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      if (ctx) {
        // Prevent black backgrounds on transparent elements by drawing white first
        ctx.fillStyle = "#121212"; // Match sleek dark premium aesthetic
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

let isOptimizing = false;
export async function optimizeAllStoredProjectsInBackground() {
  if (isOptimizing) return;
  isOptimizing = true;
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(KEYS.PROJECTS);

    request.onsuccess = async () => {
      const projects = (request.result || PROJECTS) as Project[];
      let updatedAny = false;
      
      const updatedProjects = await Promise.all(projects.map(async (p) => {
        let coverUpdated = false;
        let galleryUpdated = false;
        
        let optimizedCover = p.fullImage;
        if (p.fullImage && p.fullImage.startsWith("data:") && p.fullImage.length > 200000) {
          try {
            const compressed = await compressBase64(p.fullImage, 1000, 0.75);
            if (compressed.length < p.fullImage.length) {
              optimizedCover = compressed;
              coverUpdated = true;
            }
          } catch (e) {
            console.error("Failed background cover compression:", e);
          }
        }
        
        const optimizedGallery = p.gallery ? [...p.gallery] : [];
        if (p.gallery) {
          for (let i = 0; i < p.gallery.length; i++) {
            const img = p.gallery[i];
            if (img && img.startsWith("data:") && img.length > 150000) {
              try {
                const compressed = await compressBase64(img, 900, 0.70);
                if (compressed.length < img.length) {
                  optimizedGallery[i] = compressed;
                  galleryUpdated = true;
                }
              } catch (e) {
                console.error("Failed background gallery compression:", e);
              }
            }
          }
        }
        
        if (coverUpdated || galleryUpdated) {
          updatedAny = true;
          return {
            ...p,
            fullImage: optimizedCover,
            gallery: optimizedGallery
          };
        }
        return p;
      }));
      
      if (updatedAny) {
        console.log("Database background optimizer: successfully compressed legacy high-res project images.");
        const saveTransaction = db.transaction(STORE_NAME, "readwrite");
        const saveStore = saveTransaction.objectStore(STORE_NAME);
        saveStore.put(updatedProjects, KEYS.PROJECTS);
        saveTransaction.oncomplete = () => {
          window.dispatchEvent(new Event("earthfirm_portfolio_updated"));
        };
      }
    };
  } catch (err) {
    console.error("Database background optimizer exception:", err);
  } finally {
    isOptimizing = false;
  }
}

export async function fetchLocalProjects(): Promise<Project[]> {
  const data = await getStored<Project[]>(KEYS.PROJECTS, PROJECTS);
  // Schedule passive background sweep after a 2.5s delay to ensure no thread block on initial transition
  setTimeout(() => {
    optimizeAllStoredProjectsInBackground();
  }, 2500);
  return data;
}

export async function saveLocalProject(project: Omit<Project, 'id'>) {
  const list = await fetchLocalProjects();
  const newProj: Project = {
    ...project,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };
  list.push(newProj);
  await setStored(KEYS.PROJECTS, list);
  window.dispatchEvent(new Event("earthfirm_portfolio_updated"));
  return newProj;
}

export async function updateLocalProject(project: Project) {
  const list = await fetchLocalProjects();
  const updated = list.map(p => p.id === project.id ? project : p);
  await setStored(KEYS.PROJECTS, updated);
  window.dispatchEvent(new Event("earthfirm_portfolio_updated"));
}

export async function updateAllLocalProjects(projects: Project[]) {
  await setStored(KEYS.PROJECTS, projects);
  window.dispatchEvent(new Event("earthfirm_portfolio_updated"));
}

export async function deleteLocalProject(id: string) {
  const list = await fetchLocalProjects();
  const filtered = list.filter(p => p.id !== id);
  await setStored(KEYS.PROJECTS, filtered);
  window.dispatchEvent(new Event("earthfirm_portfolio_updated"));
}

export async function updateLocalProjectHighlights(selectedIds: string[]) {
  const list = await fetchLocalProjects();
  const updated = list.map(p => ({
    ...p,
    isHighlight: selectedIds.includes(p.id)
  }));
  await setStored(KEYS.PROJECTS, updated);
  window.dispatchEvent(new Event("earthfirm_portfolio_updated"));
  return updated;
}

// 3. Testimonials
export async function fetchLocalTestimonials(): Promise<Testimonial[]> {
  return await getStored<Testimonial[]>(KEYS.TESTIMONIALS, TESTIMONIALS);
}

export async function saveLocalTestimonial(testimonial: Omit<Testimonial, 'id'>) {
  const list = await fetchLocalTestimonials();
  const newTest: Testimonial = {
    ...testimonial,
    id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };
  list.push(newTest);
  await setStored(KEYS.TESTIMONIALS, list);
  return newTest;
}

export async function deleteLocalTestimonial(id: string) {
  const list = await fetchLocalTestimonials();
  const filtered = list.filter(t => t.id !== id);
  await setStored(KEYS.TESTIMONIALS, filtered);
}

// 4. Clients/Partners
export async function fetchLocalClients(): Promise<Client[]> {
  return await getStored<Client[]>(KEYS.PARTNERS, CLIENTS);
}

export async function saveLocalClient(client: Omit<Client, 'id'>) {
  const list = await fetchLocalClients();
  const newClient: Client = {
    ...client,
    id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };
  list.push(newClient);
  await setStored(KEYS.PARTNERS, list);
  return newClient;
}

export async function deleteLocalClient(id: string) {
  const list = await fetchLocalClients();
  const filtered = list.filter(c => c.id !== id);
  await setStored(KEYS.PARTNERS, filtered);
}

// 5. Video Testimonials
export async function fetchLocalVideoTestimonials(): Promise<VideoTestimonial[]> {
  return await getStored<VideoTestimonial[]>(KEYS.VIDEO_TESTIMONIALS, VIDEO_TESTIMONIALS);
}

export async function saveLocalVideoTestimonial(vt: Omit<VideoTestimonial, 'id'>) {
  const list = await fetchLocalVideoTestimonials();
  const newVT: VideoTestimonial = {
    ...vt,
    id: `vt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };
  list.push(newVT);
  await setStored(KEYS.VIDEO_TESTIMONIALS, list);
  return newVT;
}

export async function deleteLocalVideoTestimonial(id: string) {
  const list = await fetchLocalVideoTestimonials();
  const filtered = list.filter(v => v.id !== id);
  await setStored(KEYS.VIDEO_TESTIMONIALS, filtered);
}

// 6. Team
export async function fetchLocalTeam(): Promise<any[]> {
  return await getStored<any[]>(KEYS.TEAM, DEFAULT_TEAM);
}

export async function saveLocalTeamMember(member: any) {
  const list = await fetchLocalTeam();
  const newMember = {
    ...member,
    id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };
  list.push(newMember);
  await setStored(KEYS.TEAM, list);
  return newMember;
}

export async function updateLocalTeamMember(member: any) {
  const list = await fetchLocalTeam();
  const updated = list.map(m => m.id === member.id ? member : m);
  await setStored(KEYS.TEAM, updated);
}

export async function deleteLocalTeamMember(id: string) {
  const list = await fetchLocalTeam();
  const filtered = list.filter(m => m.id !== id);
  await setStored(KEYS.TEAM, filtered);
}

// 7. Activities
export async function logLocalActivity(action: string, details: string) {
  try {
    const list = await getStored<any[]>(KEYS.ACTIVITIES, []);
    const newAct = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    list.unshift(newAct);
    if (list.length > 50) {
      list.splice(50);
    }
    await setStored(KEYS.ACTIVITIES, list);
  } catch (error) {
    console.error("Failed to log activity locally:", error);
  }
}

export async function fetchLocalActivities(): Promise<any[]> {
  return await getStored<any[]>(KEYS.ACTIVITIES, []);
}

// 8. Submissions (Applications & Consultations)
export async function saveLocalApplication(appData: any) {
  const list = await getStored<any[]>(KEYS.APPLICATIONS, []);
  const newApp = {
    ...appData,
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: "New",
    submittedAt: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };
  list.unshift(newApp);
  await setStored(KEYS.APPLICATIONS, list);
}

export async function saveLocalConsultation(consultationData: any) {
  const list = await getStored<any[]>(KEYS.CONSULTATIONS, []);
  const newCons = {
    ...consultationData,
    id: `cons_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: "New",
    submittedAt: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };
  list.unshift(newCons);
  await setStored(KEYS.CONSULTATIONS, list);
}

export async function fetchLocalSubmissions() {
  const applications = await getStored<any[]>(KEYS.APPLICATIONS, []);
  const consultations = await getStored<any[]>(KEYS.CONSULTATIONS, []);
  return {
    applications,
    consultations
  };
}

export async function updateLocalSubmissionStatus(type: string, id: string, status: string) {
  const key = type === "application" ? KEYS.APPLICATIONS : KEYS.CONSULTATIONS;
  const list = await getStored<any[]>(key, []);
  const updated = list.map(item => item.id === id ? { ...item, status } : item);
  await setStored(key, updated);
}

export async function deleteLocalSubmission(type: string, id: string) {
  const key = type === "application" ? KEYS.APPLICATIONS : KEYS.CONSULTATIONS;
  const list = await getStored<any[]>(key, []);
  const filtered = list.filter(item => item.id !== id);
  await setStored(key, filtered);
}

export async function bulkUpdateLocalStatus(type: string, ids: string[], status: string) {
  const key = type === "application" ? KEYS.APPLICATIONS : KEYS.CONSULTATIONS;
  const list = await getStored<any[]>(key, []);
  const updated = list.map(item => ids.includes(item.id) ? { ...item, status } : item);
  await setStored(key, updated);
}

export async function bulkDeleteLocalSubmissions(type: string, ids: string[]) {
  const key = type === "application" ? KEYS.APPLICATIONS : KEYS.CONSULTATIONS;
  const list = await getStored<any[]>(key, []);
  const filtered = list.filter(item => !ids.includes(item.id));
  await setStored(key, filtered);
}
