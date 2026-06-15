
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PROJECTS, TESTIMONIALS, CLIENTS, VIDEO_TESTIMONIALS } from "../data";

export async function migrateAllData() {
  console.log("Starting migration...", { PROJECTS_length: PROJECTS.length });
  
  try {
    // Migrate Projects
    console.log("Migrating projects...", PROJECTS);
    for (const p of PROJECTS) {
      await setDoc(doc(db, 'projects', p.id), p);
    }
    console.log("Projects migrated");

    // Migrate Testimonials
    for (const t of TESTIMONIALS) {
      await setDoc(doc(db, 'testimonials', t.id), t);
    }
    console.log("Testimonials migrated");

    // Migrate Clients
    for (const c of CLIENTS) {
      await setDoc(doc(db, 'clients', c.id), c);
    }
    console.log("Clients migrated");

    // Migrate Video Testimonials
    for (const vt of VIDEO_TESTIMONIALS) {
        await setDoc(doc(db, 'videoTestimonials', vt.id), vt);
    }
    console.log("Video Testimonials migrated");

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed", err);
    throw err;
  }
}
