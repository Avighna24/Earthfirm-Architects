import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup storage directories at process.cwd() level to keep them safe and persistent
const dataDir = path.resolve(process.cwd(), "data");
const uploadsDir = path.resolve(process.cwd(), "uploads");
const resumesDir = path.resolve(uploadsDir, "resumes");
const portfoliosDir = path.resolve(uploadsDir, "portfolios");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });
if (!fs.existsSync(portfoliosDir)) fs.mkdirSync(portfoliosDir, { recursive: true });

const applicationsPath = path.join(dataDir, "applications.json");
const consultationsPath = path.join(dataDir, "consultations.json");
const activitiesPath = path.join(dataDir, "activities.json");

if (!fs.existsSync(applicationsPath)) {
  fs.writeFileSync(applicationsPath, JSON.stringify([], null, 2));
}
if (!fs.existsSync(consultationsPath)) {
  fs.writeFileSync(consultationsPath, JSON.stringify([], null, 2));
}
if (!fs.existsSync(activitiesPath)) {
  const initialActivities = [
    {
      id: "act_baseline_1",
      action: "System Initialization",
      details: "Earth Firm Admin portal launched successfully.",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: "act_baseline_2",
      action: "Analytics Updated",
      details: "Recharts configuration compiled and baseline populated.",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ];
  fs.writeFileSync(activitiesPath, JSON.stringify(initialActivities, null, 2));
}

function logActivity(action: string, details: string) {
  try {
    const activities = JSON.parse(fs.readFileSync(activitiesPath, "utf-8"));
    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    activities.unshift(newActivity);
    if (activities.length > 50) {
      activities.splice(50);
    }
    fs.writeFileSync(activitiesPath, JSON.stringify(activities, null, 2));
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// Mock Database / Data moved to server side
const DATA = {
  PROJECTS: [
    { id: "landmark-greens", title: "Landmark Greens", category: "landscape", location: "Indore (M.P.)", sustainabilityScore: 92 },
    { id: "anjna-resort", title: "Anjna Hotels & Resort", category: "landscape", location: "Barkheda, Indore MP", sustainabilityScore: 88 },
    { id: "kalindi-smart-city", title: "Kalindi Smart City", category: "landscape", location: "Pithampur MP", sustainabilityScore: 95 }
  ],
  SERVICES: [
    { id: "architecture", title: "Architecture & Planning" },
    { id: "interior", title: "Interior Design" },
    { id: "landscape", title: "Landscape Architecture" }
  ]
};

// Helper for saving dynamic base64 files
function saveBase64File(base64DataUrl: string, destDir: string, baseFilename: string): string {
  const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 format received");
  }
  const fileBuffer = Buffer.from(matches[2], 'base64');
  
  // Clean special characters from file name
  const timestamp = Date.now();
  const safeName = baseFilename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const finalFilename = `${timestamp}_${safeName}`;
  const finalPath = path.join(destDir, finalFilename);
  
  fs.writeFileSync(finalPath, fileBuffer);
  return finalFilename;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure express parsed limits for larger portfolio/resume base64 uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Static serving of physically uploaded files
  app.use("/uploads", express.static(uploadsDir));

  // Core API Routes
  app.get("/api/projects", (req, res) => {
    res.json(DATA.PROJECTS);
  });

  app.get("/api/services", (req, res) => {
    res.json(DATA.SERVICES);
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", theme: "dark", branding: "Earth Firm Architects" });
  });

  // POST endpoint for Career / Job applications (Build with Us)
  app.post("/api/submit-application", (req, res) => {
    try {
      const { fullName, email, contactNumber, appliedFor, appliedAs, description, resumeFile, portfolioFile } = req.body;
      
      if (!fullName || !email || !contactNumber || !appliedFor || !resumeFile || !portfolioFile) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Handle resume saving
      const resumeFilename = saveBase64File(resumeFile.data, resumesDir, resumeFile.name);
      
      // Handle portfolio saving
      const portfolioFilename = saveBase64File(portfolioFile.data, portfoliosDir, portfolioFile.name);

      // Save application details to DB
      const apps = JSON.parse(fs.readFileSync(applicationsPath, "utf-8"));
      const newApp = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        fullName,
        email,
        contactNumber,
        appliedFor,
        appliedAs,
        description,
        resumeFilename,
        resumeName: resumeFile.name,
        resumeUrl: `/uploads/resumes/${resumeFilename}`,
        portfolioFilename,
        portfolioName: portfolioFile.name,
        portfolioUrl: `/uploads/portfolios/${portfolioFilename}`,
        submittedAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: "New"
      };

      apps.unshift(newApp);
      fs.writeFileSync(applicationsPath, JSON.stringify(apps, null, 2));

      res.status(200).json({ success: true, application: newApp });
    } catch (err: any) {
      console.error("Application submission backend error:", err);
      res.status(500).json({ error: err.message || "Internal server error saving files." });
    }
  });

  // POST endpoint for Book Advisory / Consultation sessions
  app.post("/api/submit-consultation", (req, res) => {
    try {
      const { name, email, phone, projectType, budgetRange, message } = req.body;
      
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const consultations = JSON.parse(fs.readFileSync(consultationsPath, "utf-8"));
      const newConsultation = {
        id: `cons_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name,
        email,
        phone,
        projectType,
        budgetRange,
        message,
        submittedAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: "New"
      };

      consultations.unshift(newConsultation);
      fs.writeFileSync(consultationsPath, JSON.stringify(consultations, null, 2));

      res.status(200).json({ success: true, consultation: newConsultation });
    } catch (err: any) {
      console.error("Consultation submission backend error:", err);
      res.status(500).json({ error: err.message || "Internal server error booking session." });
    }
  });

  // ADMIN ENDPOINT to list submissions
  app.get("/api/admin/submissions", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "earthfirm2026") {
      return res.status(401).json({ error: "Unauthorized access. Invalid passcode." });
    }

    try {
      const applications = JSON.parse(fs.readFileSync(applicationsPath, "utf-8"));
      const consultations = JSON.parse(fs.readFileSync(consultationsPath, "utf-8"));
      res.status(200).json({ applications, consultations });
    } catch (err) {
      res.status(500).json({ error: "Internal database read error." });
    }
  });

  // ADMIN ENDPOINT to update a submission status
  app.post("/api/admin/update-status", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "earthfirm2026") {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { type, id, status } = req.body;
    if (!["New", "Reviewed", "Archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    try {
      if (type === "application") {
        const apps = JSON.parse(fs.readFileSync(applicationsPath, "utf-8"));
        const target = apps.find((a: any) => a.id === id);
        if (target) {
          target.status = status;
          fs.writeFileSync(applicationsPath, JSON.stringify(apps, null, 2));
          logActivity("Status Updated", `Changed dossier status for candidate ${target.fullName} to ${status}`);
          res.json({ success: true, application: target });
        } else {
          res.status(404).json({ error: "Application not found." });
        }
      } else {
        const cons = JSON.parse(fs.readFileSync(consultationsPath, "utf-8"));
        const target = cons.find((c: any) => c.id === id);
        if (target) {
          target.status = status;
          fs.writeFileSync(consultationsPath, JSON.stringify(cons, null, 2));
          logActivity("Status Updated", `Changed advisory booking status for ${target.name} to ${status}`);
          res.json({ success: true, consultation: target });
        } else {
          res.status(404).json({ error: "Consultation not found." });
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ error: "Failed to update status." });
    }
  });

  // ADMIN ENDPOINT to delete single submission
  app.post("/api/admin/delete-submission", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "earthfirm2026") {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { type, id } = req.body;
    try {
      if (type === "application") {
        let apps = JSON.parse(fs.readFileSync(applicationsPath, "utf-8"));
        const target = apps.find((a: any) => a.id === id);
        if (target) {
          if (target.resumeFilename) {
            const rPath = path.join(resumesDir, target.resumeFilename);
            if (fs.existsSync(rPath)) fs.unlinkSync(rPath);
          }
          if (target.portfolioFilename) {
            const pPath = path.join(portfoliosDir, target.portfolioFilename);
            if (fs.existsSync(pPath)) fs.unlinkSync(pPath);
          }
          logActivity("Dossier Purged", `Permanently deleted dossier for candidate ${target.fullName}.`);
        }
        apps = apps.filter((a: any) => a.id !== id);
        fs.writeFileSync(applicationsPath, JSON.stringify(apps, null, 2));
      } else {
        let cons = JSON.parse(fs.readFileSync(consultationsPath, "utf-8"));
        const target = cons.find((c: any) => c.id === id);
        if (target) {
          logActivity("Enquiry Purged", `Permanently deleted discovery enquiry by ${target.name}.`);
        }
        cons = cons.filter((c: any) => c.id !== id);
        fs.writeFileSync(consultationsPath, JSON.stringify(cons, null, 2));
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // ADMIN ENDPOINT to bulk update status of multiple submissions
  app.post("/api/admin/bulk-update-status", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "earthfirm2026") {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { type, ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No ids provided." });
    }
    if (!["New", "Reviewed", "Archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    try {
      if (type === "application") {
        let apps = JSON.parse(fs.readFileSync(applicationsPath, "utf-8"));
        let updatedCount = 0;
        apps = apps.map((a: any) => {
          if (ids.includes(a.id)) {
            updatedCount++;
            return { ...a, status };
          }
          return a;
        });
        fs.writeFileSync(applicationsPath, JSON.stringify(apps, null, 2));
        logActivity("Bulk Status Update", `Batch processed status of ${updatedCount} candidate dossiers to '${status}'.`);
        res.json({ success: true, updatedCount });
      } else {
        let cons = JSON.parse(fs.readFileSync(consultationsPath, "utf-8"));
        let updatedCount = 0;
        cons = cons.map((c: any) => {
          if (ids.includes(c.id)) {
            updatedCount++;
            return { ...c, status };
          }
          return c;
        });
        fs.writeFileSync(consultationsPath, JSON.stringify(cons, null, 2));
        logActivity("Bulk Status Update", `Batch processed status of ${updatedCount} advisory bookings to '${status}'.`);
        res.json({ success: true, updatedCount });
      }
    } catch (err) {
      console.error("Bulk status update failed:", err);
      res.status(500).json({ error: "Bulk status update failed" });
    }
  });

  // ADMIN ENDPOINT to bulk delete multiple submissions
  app.post("/api/admin/bulk-delete", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "earthfirm2026") {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { type, ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No ids provided." });
    }

    try {
      if (type === "application") {
        let apps = JSON.parse(fs.readFileSync(applicationsPath, "utf-8"));
        const deletedNames: string[] = [];
        ids.forEach((id: string) => {
          const target = apps.find((a: any) => a.id === id);
          if (target) {
            deletedNames.push(target.fullName);
            if (target.resumeFilename) {
              const rPath = path.join(resumesDir, target.resumeFilename);
              if (fs.existsSync(rPath)) fs.unlinkSync(rPath);
            }
            if (target.portfolioFilename) {
              const pPath = path.join(portfoliosDir, target.portfolioFilename);
              if (fs.existsSync(pPath)) fs.unlinkSync(pPath);
            }
          }
        });
        apps = apps.filter((a: any) => !ids.includes(a.id));
        fs.writeFileSync(applicationsPath, JSON.stringify(apps, null, 2));
        logActivity("Bulk Purge", `Permanently batch-deleted ${ids.length} candidate dossiers (${deletedNames.join(", ")}).`);
      } else {
        let cons = JSON.parse(fs.readFileSync(consultationsPath, "utf-8"));
        const deletedNames: string[] = [];
        ids.forEach((id: string) => {
          const target = cons.find((c: any) => c.id === id);
          if (target) {
            deletedNames.push(target.name);
          }
        });
        cons = cons.filter((c: any) => !ids.includes(c.id));
        fs.writeFileSync(consultationsPath, JSON.stringify(cons, null, 2));
        logActivity("Bulk Purge", `Permanently batch-deleted ${ids.length} discovery Advisory bookings (${deletedNames.join(", ")}).`);
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Bulk delete failed:", err);
      res.status(500).json({ error: "Bulk delete failed" });
    }
  });

  // ADMIN ENDPOINT to fetch recent activities
  app.get("/api/admin/activities", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "earthfirm2026") {
      return res.status(401).json({ error: "Unauthorized." });
    }
    try {
      const activities = JSON.parse(fs.readFileSync(activitiesPath, "utf-8"));
      res.json(activities);
    } catch (err) {
      console.error("Failed to read activities:", err);
      res.status(500).json({ error: "Failed to read activities" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
