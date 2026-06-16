/**
 * Types defining data models for Earth Firm Architects interactive portfolio.
 */

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  keyMaterials: string[];
  workflow: string[];
  highlights: string[];
}

export interface Project {
  id: string;
  title: string;
  category: "architecture" | "interior" | "landscape" | "commercial";
  location: string;
  area: string;
  year: string;
  duration: string;
  sustainabilityScore?: number;
  materials: string[];
  description: string;
  fullImage: string; // Base64 or URL
  gallery?: string[]; // Base64s or URLs
  blueprintSVGId?: string; // Used to select local stylized blueprint illustration
  features: string[];
  clientName?: string;
  status?: string;
  progress?: number;
  phase?: string;
  tagline?: string;
  isHighlight?: boolean;
  order?: number;
}

export interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  project: string;
  quote: string;
  videoUrl: string;
  avatar: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  project?: string;
  quote: string;
  rating?: number;
  avatar: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  fallbackAcronym?: string;
  description?: string;
  industry?: string;
  prominentProject?: string;
  logo?: string;
  url?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    style: "biophilic" | "industrial" | "minimalist" | "earth-brutalist";
    image: string;
  }[];
}