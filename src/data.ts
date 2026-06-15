import hero1 from "./assets/images/home_page_1.png";
import hero2 from "./assets/images/home_page_2.png";
import hero3 from "./assets/images/home_page_3.png";

import { Service, Project, Testimonial, QuizQuestion, Client, VideoTestimonial } from "./types";

// Import paths for fixed project assets
export const HERO_IMAGES = [
  hero1,
  hero2,
  hero3
];
export const HERO_IMAGE = HERO_IMAGES[0];
export const ARCHITECTURE_IMAGE = "https://earthfirmarchitects.com/media/architecture_planning.png";
export const INTERIOR_IMAGE = "https://earthfirmarchitects.com/media/Interior.png";
export const LANDSCAPE_IMAGE = "https://earthfirmarchitects.com/media/Landscape_img.png";

export const SERVICES: Service[] = [
  {
    id: "architecture",
    title: "Architecture & Planning",
    shortDescription: "Designing sustainable spaces that merge with nature, letting natural light and structural integrity define living.",
    longDescription: "Our architectural philosophy is anchored in environmental sensitivity, durability, and a clean structural voice. We craft residences and commercial complexes that stand the test of time, utilizing bioclimatic principles to maximize heating/cooling efficiency naturally while celebrating raw materials.",
    image: ARCHITECTURE_IMAGE,
    keyMaterials: ["Exposed Cast Concrete", "Reclaimed Teakwood", "Local Granite Slates", "Low-E Triple Glazing"],
    workflow: [
      "Site Mapping & Solar Orientation Analysis",
      "Conceptual Layout Drafting & Energy Modeling",
      "3D Spatial Walkthroughs & Material Sourcing",
      "Structural Engineering & Environment-Impact Auditing",
      "On-Site Supervision & Quality Assurance Work"
    ],
    highlights: ["Passive Solar Design", "Double-Height Light Well Integrations", "Optimized Thermal Mass Walls", "Rainwater Harvesting Frameworks"]
  },
  {
    id: "interior",
    title: "Interior Design",
    shortDescription: "Bespoke internal workspaces and residences utilizing neutral earth guides, organic textiles, and seamless woodwork.",
    longDescription: "We believe an interior should feel like a sanctuary. By avoiding toxic adhesives and microplastics, we prioritize raw natural stones, plant-dyed linen upholstery, and solid hardwoods configured via traditional Japanese joinery. The results are modern interiors that physically soothe and optimize cognitive focus.",
    image: INTERIOR_IMAGE,
    keyMaterials: ["White Travertine Stone", "Native White Oak Wood", "Organic Cotton & Linen", "Plant-based Hardwax Oils"],
    workflow: [
      "Circulation & Ergonomics Workspace Mapping",
      "Mood Boarding, Acoustic & Lux Level Planning",
      "Custom Furniture Design & Millwork Detail Drafting",
      "Sustainable Upholstery & Non-VOC Coating Sourcing",
      "Precise Installation & Curated Art Pairing"
    ],
    highlights: ["Invisible Smart Storage", "Integrated Biophilic Living Walls", "Acoustic Softening Integrations", "Custom Hidden Lighting Systems"]
  },
  {
    id: "landscape",
    title: "Landscape Architecture",
    shortDescription: "Regenerative landscape designs comprising native flora, custom masonry, and tranquil water features.",
    longDescription: "Rather than treating landscape as ornament, we consider it a living infrastructure. We design functional outdoor ecosystems—from urban rooftop pollinator gardens to expansive estate bioswales. By focusing entirely on native xeriscape plantings, we design lush gardens that require minimal water while enriching local biodiversity.",
    image: LANDSCAPE_IMAGE,
    keyMaterials: ["Rough-hewn Local Basalt", "Permeable Natural Aggregates", "Corten Steel Panels", "Recycled Terrace Timber"],
    workflow: [
      "Topographical Levelling & Hydrology Mapping",
      "Native Flora Sourcing & Soil Renovation Plans",
      "Hardscaping Design & Fire/Water Axis Setup",
      "Irrigation Design (Gravity-fed/Greywater Routing)",
      "Planting execution & Microgrid Installation"
    ],
    highlights: ["Natural Filtration Swimming Pools", "Native Pollinator Pathways", "Sculptural Corten Retaining Terraces", "Outdoor Sunken Discussion Fire-pits"]
  }
];

export const PROJECTS: Project[] = [
{
    id: "landmark-greens",
    title: "Landmark Greens",
    category: "architecture",
    location: "INDORE, MP",
    area: "8,500 sq ft",
    year: "2023",
    duration: "24 Months",
    sustainabilityScore: 92,
    materials: ["Thermal Mass Walls", "Recycled Ash Brick", "Sustainable Timber", "Clear Glazing"],
    description: "A home designed for silence, light, and belonging. This residence utilizes monumental geometries to create a sanctuary of extreme quietude while maximizing biophilic connection.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/landmark_greens_06_1.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/landmark_greens_010.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_09_C7rY6Xi.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_08.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_07.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_06.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_03.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_0.webp", "https://earthfirmarchitects.com/media/project_images/landmark_greens_02.webp"],
    blueprintSVGId: "eco-villa-blueprint",
    features: ["Acoustic Seclusion", "Central Lightwell", "Thermal Passive Cooling"],
    clientName: "Private Client"
  },
  {
    id: "anjna-resort",
    title: "Anjna Hotels & Resort",
    category: "architecture",
    location: "PUNE, MH",
    area: "12,000 sq ft",
    year: "2024",
    duration: "18 Months",
    sustainabilityScore: 88,
    materials: ["Corten Steel Panels", "Exposed Cast Concrete", "Reclaimed Teakwood", "Natural Slates"],
    description: "A linear villa unfurling toward the horizon. The Long Veil explores horizontal expansion, utilizing a continuous wooden deck and glass facade to merge internal sanctuaries with the distant landscape.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/main.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/Site_View_1_3ICiRDI.webp", "https://earthfirmarchitects.com/media/project_images/Site_View_2_ozWn4Ts.webp", "https://earthfirmarchitects.com/media/project_images/Admin_View_1_PtcxoDs.webp", "https://earthfirmarchitects.com/media/project_images/Admin_View_2_Ua77Z9M.webp", "https://earthfirmarchitects.com/media/project_images/Banquet_1_ZSjkBvf.webp", "https://earthfirmarchitects.com/media/project_images/Banquet_2_KOrd675.webp", "https://earthfirmarchitects.com/media/project_images/Cottages_1.webp", "https://earthfirmarchitects.com/media/project_images/Cottages_2.webp"],
    blueprintSVGId: "travertine-blueprint",
    features: ["Horizontal Continuity", "Cantilevered Living", "Shaded Solar Veils"],
    clientName: "Private Commission"
  },
  {
    id: "kalindi-smart-city",
    title: "Kalindi Smart City",
    category: "landscape",
    location: "Pithampur MP",
    area: "250,000 sq ft",
    year: "2022",
    duration: "36 Months",
    sustainabilityScore: 95,
    materials: ["Recycled Steel", "Permeable Concrete", "Low-E Glazing", "Solar Panels"],
    description: "A massive urban planning achievement that redefines smart living. Incorporates sustainable energy microgrids, native landscaping, and zero-net energy infrastructure for a modern community.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/00gate.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/0.1sitemap.webp", "https://earthfirmarchitects.com/media/project_images/1gatee.webp", "https://earthfirmarchitects.com/media/project_images/2.hall.webp", "https://earthfirmarchitects.com/media/project_images/3hall_garden.webp", "https://earthfirmarchitects.com/media/project_images/4kidsgarden.webp", "https://earthfirmarchitects.com/media/project_images/5selfie.webp", "https://earthfirmarchitects.com/media/project_images/6water_tank.webp", "https://earthfirmarchitects.com/media/project_images/7temple.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Energy Microgrids", "Zero-Net Energy Capability", "Smart Waste Management"],
    clientName: "Kalindi Group"
  },

  // COMMERCIAL PROJECTS
  
  // LANDSCAPE PROJECTS
  {
    id: "kanha-corridor",
    title: "Kanha Corridor",
    category: "landscape",
    location: "Unknown",
    area: "Various",
    year: "2023",
    duration: "12 Months",
    sustainabilityScore: 90,
    materials: ["Native Stone", "Sustainable Timber", "Local Granites"],
    description: "A sprawling landscape highlighting natural topography and preserving native flora while providing modern accessibility.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_v9OEONX.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_3_-_Photo_nck9482.webp", "https://earthfirmarchitects.com/media/project_images/OPTION_1.webp", "https://earthfirmarchitects.com/media/project_images/1_5_-_Photo_bSrvvYd.webp", "https://earthfirmarchitects.com/media/project_images/1_6_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_3_-_Photo_1KZVh8R.webp", "https://earthfirmarchitects.com/media/project_images/1_4_-_Photo_XGpbdUI.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_6wsFQDD.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_XyakBrw.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Natural Walkways", "Ecosystem Preservation"]
  },
  {
    id: "landmark-city",
    title: "Landmark City",
    category: "landscape",
    location: "Unknown",
    area: "Various",
    year: "2023",
    duration: "18 Months",
    sustainabilityScore: 88,
    materials: ["Recycled Aggregates", "Exposed Concrete", "Green Tiles"],
    description: "Large scale landscape integration for an emerging urban development, balancing paved pathways with green belts.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/0.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_H5jNYxg.webp", "https://earthfirmarchitects.com/media/project_images/2_NXJ4EFO.webp", "https://earthfirmarchitects.com/media/project_images/3_YSE4n59.webp", "https://earthfirmarchitects.com/media/project_images/4_l0FMLOr.webp", "https://earthfirmarchitects.com/media/project_images/5_Y4zBlwo.webp", "https://earthfirmarchitects.com/media/project_images/6_Md3O1nl.webp", "https://earthfirmarchitects.com/media/project_images/7_TJuUqlX.webp", "https://earthfirmarchitects.com/media/project_images/8.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Green Belts", "Urban Integration"]
  },
  {
    id: "mufaddal-city",
    title: "Mufaddal City",
    category: "landscape",
    location: "Unknown",
    area: "Various",
    year: "2022",
    duration: "14 Months",
    sustainabilityScore: 91,
    materials: ["Drought Resistant Plants", "Permeable Paving", "Natural Slates"],
    description: "Sustainable township landscaping emphasizing community spaces and optimized water drainage systems.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/0_Ezi1XRS.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_bQnQuJu.webp", "https://earthfirmarchitects.com/media/project_images/2_MXDt9iW.webp", "https://earthfirmarchitects.com/media/project_images/3_ThNYtnT.webp", "https://earthfirmarchitects.com/media/project_images/4_I8uca82.webp", "https://earthfirmarchitects.com/media/project_images/5_SIAwL9e.webp", "https://earthfirmarchitects.com/media/project_images/6_1KwCgY9.webp", "https://earthfirmarchitects.com/media/project_images/7_Vgm26ON.webp", "https://earthfirmarchitects.com/media/project_images/8_5nnYS15.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Community Spaces", "Water Drainage Systems"]
  },
  {
    id: "navkar-dream-city",
    title: "Navkar Dream City",
    category: "landscape",
    location: "Unknown",
    area: "Various",
    year: "2023",
    duration: "20 Months",
    sustainabilityScore: 94,
    materials: ["Local Basalt", "Xeriscape Flora", "Corten Steel Panels"],
    description: "Expansive green corridors and aesthetically pleasing buffer zones protecting residential zones from urban noise.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/0_vOqy0UP.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_lz379Ke.webp", "https://earthfirmarchitects.com/media/project_images/2.0.webp", "https://earthfirmarchitects.com/media/project_images/2_qVmB74r.webp", "https://earthfirmarchitects.com/media/project_images/3_NffntG7.webp", "https://earthfirmarchitects.com/media/project_images/4_Csxwv99.webp", "https://earthfirmarchitects.com/media/project_images/5_ycwArOk.webp", "https://earthfirmarchitects.com/media/project_images/6_HnDPeqq.webp", "https://earthfirmarchitects.com/media/project_images/7_zIpA98t.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Green Corridors", "Acoustic Buffers"]
  },
  {
    id: "orion-park",
    title: "Orion Park",
    category: "landscape",
    location: "Unknown",
    area: "Various",
    year: "2024",
    duration: "10 Months",
    sustainabilityScore: 95,
    materials: ["Native Shrubs", "Pebbles", "Recycled Hardwood"],
    description: "A modern commercial park prioritizing pedestrian circulation and shaded resting zones.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/0_7RPB60M.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_kGaVP2Q.webp", "https://earthfirmarchitects.com/media/project_images/2_KXnIbDn.webp", "https://earthfirmarchitects.com/media/project_images/3_KXdGQF6.webp", "https://earthfirmarchitects.com/media/project_images/4_qJaUcJp.webp", "https://earthfirmarchitects.com/media/project_images/5_IXifcHP.webp", "https://earthfirmarchitects.com/media/project_images/6_XAPqqOY.webp", "https://earthfirmarchitects.com/media/project_images/7_hERDarc.webp", "https://earthfirmarchitects.com/media/project_images/8_ChU99xN.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Pedestrian Circulation", "Shaded Rest Zones"]
  },
  {
    id: "platinum-aura",
    title: "Platinum Aura",
    category: "landscape",
    location: "Unknown",
    area: "Various",
    year: "2023",
    duration: "15 Months",
    sustainabilityScore: 89,
    materials: ["White Granite", "Water Features", "Organic Mulch"],
    description: "Premium residential landscaping focusing on sophisticated water features and geometric plant beds.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_NmadhPN.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/2_19_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_YlhoYct.webp", "https://earthfirmarchitects.com/media/project_images/1_4_-_Photo_uZqdufF.webp", "https://earthfirmarchitects.com/media/project_images/1_5_-_Photo_zdTbw2k.webp", "https://earthfirmarchitects.com/media/project_images/1_6_-_Photo_2SYm51V.webp", "https://earthfirmarchitects.com/media/project_images/1_7_-_Photo_w9WQTEe.webp", "https://earthfirmarchitects.com/media/project_images/1_8_-_Photo_MIcKtNg.webp", "https://earthfirmarchitects.com/media/project_images/1_9_-_Photo.webp"],
    blueprintSVGId: "landscape-blueprint",
    features: ["Water Features", "Geometric Layouts"]
  },
  {
    id: "ratan-business-hub",
    title: "Ratan Business Hub",
    category: "commercial",
    location: "Unknown",
    area: "12,000 sq ft",
    year: "2024",
    duration: "14 Months",
    sustainabilityScore: 91,
    materials: ["Glass Facade", "Steel Frameworks", "Marble Floors"],
    description: "A dynamic commercial space built for the modern workforce, emphasizing maximizing natural sunlight.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/Untitled_design.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_LMokGNk.webp", "https://earthfirmarchitects.com/media/project_images/2_Pr1ayvl.webp", "https://earthfirmarchitects.com/media/project_images/3_20BTgNa.webp", "https://earthfirmarchitects.com/media/project_images/4_aQPrEwv.webp", "https://earthfirmarchitects.com/media/project_images/5_DHu1IJi.webp", "https://earthfirmarchitects.com/media/project_images/6_CRRqBn9.webp", "https://earthfirmarchitects.com/media/project_images/7_auO5wym.webp", "https://earthfirmarchitects.com/media/project_images/8_7jqddY0.webp"],
    blueprintSVGId: "solarium-blueprint",
    features: ["Natural Daylighting", "Open Floors"]
  },
  {
    id: "landmark-plaza",
    title: "Landmark Plaza",
    category: "commercial",
    location: "Unknown",
    area: "40,000 sq ft",
    year: "2023",
    duration: "22 Months",
    sustainabilityScore: 87,
    materials: ["Aluminum Panels", "Acoustic Glass", "Concrete Core"],
    description: "Mixed-use commercial structure offering retail at street level and optimized office configurations above.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_2_ojTMdHF.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_AWeWhn4.webp", "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_2_0qDQHHX.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_Q1oCygb.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_2_eYWCV2Z.webp"],
    blueprintSVGId: "solarium-blueprint",
    features: ["Retail & Office Mixed", "Acoustic Performance"]
  },
  {
    id: "town-plaza",
    title: "Town Plaza",
    category: "commercial",
    location: "Unknown",
    area: "32,000 sq ft",
    year: "2023",
    duration: "16 Months",
    sustainabilityScore: 88,
    materials: ["Brick Cladding", "Steel Canopies", "Performance Glass"],
    description: "Community-focused commercial center with central gathering spaces designed for maximum foot traffic.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/0_0Lhn5oK.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1.0.webp", "https://earthfirmarchitects.com/media/project_images/1_um6vbg3.webp", "https://earthfirmarchitects.com/media/project_images/2_WYAdIeK.webp", "https://earthfirmarchitects.com/media/project_images/3_wfRQeMz.webp", "https://earthfirmarchitects.com/media/project_images/4_7zVQ34w.webp", "https://earthfirmarchitects.com/media/project_images/5_NvhxSbN.webp", "https://earthfirmarchitects.com/media/project_images/6_t2Hvm1M.webp", "https://earthfirmarchitects.com/media/project_images/7_Pn2Opkt.webp"],
    blueprintSVGId: "solarium-blueprint",
    features: ["Community Plaza", "High Foot Traffic Design"]
  },

  // ARCHITECTURE PROJECTS
  {
    id: "ajay-sengar",
    title: "Ajay Sengar",
    category: "architecture",
    location: "Unknown",
    area: "6,000 sq ft",
    year: "2024",
    duration: "12 Months",
    sustainabilityScore: 93,
    materials: ["Exposed Brick", "Terracotta Tiles", "Reclaimed Wood"],
    description: "Custom residential architecture focusing on biophilic connection and breathable living spaces.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_5_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_4_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_3_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_qVvgdrD.webp"],
    blueprintSVGId: "eco-villa-blueprint",
    features: ["Breathable Spaces", "Biophilic Connections"]
  },
  {
    id: "kalindi-pride",
    title: "Kalindi Pride",
    category: "architecture",
    location: "Unknown",
    area: "14,000 sq ft",
    year: "2023",
    duration: "16 Months",
    sustainabilityScore: 89,
    materials: ["Pre-cast Concrete", "Triple Glazing", "Recycled Hardwood"],
    description: "Premium architectural design combining brutalist forms with warm internal textures.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_3_-_Photo_2.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_3_-_Photo_rS4g6W3.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_2w3DIzl.webp", "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_2.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_2.webp", "https://earthfirmarchitects.com/media/project_images/1_3_-_Photo_2_8DuqiEO.webp"],
    blueprintSVGId: "eco-villa-blueprint",
    features: ["Brutalist Forms", "Warm Textures"]
  },
  {
    id: "nikhil-residence",
    title: "Nikhil Ji Residence",
    category: "architecture",
    location: "Unknown",
    area: "4,500 sq ft",
    year: "2025",
    duration: "9 Months",
    sustainabilityScore: 94,
    materials: ["Teak Wood", "Natural Earth Plaster", "Slate Floors"],
    description: "Private residence crafted around a massive central lightwell, prioritizing family privacy and extreme quietude.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/option_4_3.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/option_4_1.webp", "https://earthfirmarchitects.com/media/project_images/option_4_2.webp", "https://earthfirmarchitects.com/media/project_images/option_4_3_WfNdpJ6.webp"],
    blueprintSVGId: "eco-villa-blueprint",
    features: ["Central Lightwell", "Acoustic Silence"]
  },
  {
    id: "pravin-residence",
    title: "Pravin Ji Residence",
    category: "architecture",
    location: "Unknown",
    area: "5,200 sq ft",
    year: "2024",
    duration: "11 Months",
    sustainabilityScore: 91,
    materials: ["White Marble", "Brass Accents", "Sustainable Teak"],
    description: "Minimalist architecture emphasizing clean horizontal lines and absolute absence of visual clutter.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_Cee2bUu.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_8_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_7_-_Photo.webp", "https://earthfirmarchitects.com/media/project_images/1_3_-_Photo_jyAApz2.webp", "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_qjoeMqG.webp"],
    blueprintSVGId: "eco-villa-blueprint",
    features: ["Clean Horizontal Lines", "Minimalist Form"]
  },
  {
    id: "feelings-gift-gallery",
    title: "Feelings Gift Gallery",
    category: "architecture",
    location: "Dhar, MP",
    area: "4,000 sq ft",
    year: "2023",
    duration: "8 Months",
    sustainabilityScore: 86,
    materials: ["Steel Frames", "Large Plate Glass", "Polished Concrete"],
    description: "A retail architectural project balancing transparency for product display and striking geometric framing.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/0_SpPW4mH.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_EDn3zix.webp", "https://earthfirmarchitects.com/media/project_images/2_AVjhVFY.webp", "https://earthfirmarchitects.com/media/project_images/3_TDnXOMi.webp", "https://earthfirmarchitects.com/media/project_images/4_dMGTokh.webp", "https://earthfirmarchitects.com/media/project_images/5_W5koydX.webp", "https://earthfirmarchitects.com/media/project_images/6_fyNClBu.webp", "https://earthfirmarchitects.com/media/project_images/7_N2AatoW.webp", "https://earthfirmarchitects.com/media/project_images/8_Q89M0Yf.webp"],
    blueprintSVGId: "eco-villa-blueprint",
    features: ["Maximum Transparency", "Geometric Frames"]
  },
  {
    id: "springfield-row-house",
    title: "Springfield Row House",
    category: "architecture",
    location: "Devas Naka, Indore MP",
    area: "12,000 sq ft",
    year: "2025",
    duration: "12 Months",
    sustainabilityScore: 91,
    materials: ["Rammed Earth Walls", "White Oak Wood", "Organic Flax Linens", "Terracotta Jali Blocks"],
    description: "A fine example of modern row-house design balancing community living with private biophilic spaces. Utilizes natural cross-ventilation through custom terracotta jali block facades.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/VIEW_3.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/VIEW_8.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_7.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_6.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_5.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_4.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_2.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_1.webp", "https://earthfirmarchitects.com/media/project_images/VIEW_3_zJUSq2Q.webp"],
    blueprintSVGId: "solarium-blueprint",
    features: ["Cross-ventilation Design", "Custom Jali Facades", "Biophilic Interiors"]
  },

  // INTERIOR PROJECTS
  {
    id: "myra-clinic",
    title: "Myra Clinic",
    category: "interior",
    location: "Manawar",
    area: "2,500 sq ft",
    year: "2024",
    duration: "5 Months",
    sustainabilityScore: 96,
    materials: ["Antimicrobial Surfaces", "Warm Linens", "Ash Wood", "Soft Cove Lighting"],
    description: "A healthcare interior design reimagined. Avoiding clinical sterility, we opted for warm hospitality-driven luxury while maintaining strict medical hygiene standards.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/cabin_2.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/cabin_1.webp", "https://earthfirmarchitects.com/media/project_images/reception_1.webp", "https://earthfirmarchitects.com/media/project_images/reception_2.webp", "https://earthfirmarchitects.com/media/project_images/reception_3.webp", "https://earthfirmarchitects.com/media/project_images/reception_4.webp", "https://earthfirmarchitects.com/media/project_images/reception_5.webp"],
    blueprintSVGId: "travertine-blueprint",
    features: ["Hospitality-driven", "Antimicrobial", "Soft Lighting"]
  },
  {
    id: "asha-sharma",
    title: "Asha Sharma",
    category: "interior",
    location: "Unknown",
    area: "Various",
    year: "2024",
    duration: "6 Months",
    sustainabilityScore: 92,
    materials: ["Premium Wood", "Textured Paint", "Subtle Lighting", "Natural Stone Accents"],
    description: "A refined interior project focusing on residential comfort, blending luxury aesthetics with highly functional everyday living spaces.",
    fullImage: "https://earthfirmarchitects.com/media/project_images/1_y9iht84.webp",
    gallery: ["https://earthfirmarchitects.com/media/project_images/1_y9iht84.webp", "https://earthfirmarchitects.com/media/project_images/2_UErA69F.webp", "https://earthfirmarchitects.com/media/project_images/3_IIQtGsU.webp", "https://earthfirmarchitects.com/media/project_images/6.webp", "https://earthfirmarchitects.com/media/project_images/7_opV044s.webp", "https://earthfirmarchitects.com/media/project_images/9.webp", "https://earthfirmarchitects.com/media/project_images/10.webp", "https://earthfirmarchitects.com/media/project_images/11.webp"],
    blueprintSVGId: "travertine-blueprint",
    features: ["Bespoke Furniture", "Atmospheric Lighting"]
  }

];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Vikram Singhania",
    role: "Developer",
    project: "Landmark Greens",
    quote: "Earthfirm Architects transformed our vision for Landmark Greens into a breathtaking reality. Their commitment to sustainable living and green architectural integration is industry leading.",
    rating: 5,
    avatar: "https://earthfirmarchitects.com/media/client_images/testi-01.webp"
  },
  {
    id: "t2",
    name: "Anjna Hospitality Group",
    role: "Client",
    project: "Anjna Hotels & Resort",
    quote: "The resort design strikes a perfect balance between modern luxury and ecological responsibility. Our guests continually praise the natural materials and the serene atmosphere they have created.",
    rating: 5,
    avatar: "https://earthfirmarchitects.com/media/clients_images/Anjana_Resort_X3OtF4h.webp"
  },
  {
    id: "t3",
    name: "Rajesh Malhotra",
    role: "Project Head",
    project: "Kalindi Smart City",
    quote: "A visionary architectural team. Their master planning for Kalindi Smart City implemented robust sustainable systems without compromising on aesthetic brilliance or structural integrity.",
    rating: 5,
    avatar: "https://earthfirmarchitects.com/media/clients_images/kalindi-logo_uNZLDjH.webp"
  }
];

export const CLIENTS: Client[] = [
  {
    id: "vara",
    name: "Vara",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/WhatsApp_Image_2024-09-06_at_4.16.01_PM-removebg-preview_eiIzOkI.webp",
    fallbackAcronym: "VR",
    description: "Infrastructure enterprise dedicated to high-performance civil structures and modern engineering layouts.",
    industry: "Infrastructural Real Estate",
    prominentProject: "Vara Civil Housing Complexes"
  },
  {
    id: "kalindi-group",
    name: "Kalindi Group",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/kalindi-logo_uNZLDjH.webp",
    fallbackAcronym: "KG",
    description: "A monumental real estate development syndicate in Madhya Pradesh, establishing satellite masterplans and residential grids.",
    industry: "Real Estate Development",
    prominentProject: "Kalindi Smart City & Landmark Greens"
  },
  {
    id: "jmg-group",
    name: "JMG Group",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/WhatsApp_Image_2024-09-06_at_4.16.01_PM__1_-removebg-preview100.webp",
    fallbackAcronym: "JMG",
    description: "A premium joint venture of Jhaveri Mehta Gandhi Group, pioneering landmark commercial centers and metropolitan offices.",
    industry: "Commercial Infrastructure",
    prominentProject: "Jhaveri Commercial Chambers"
  },
  {
    id: "universal-infra",
    name: "Universal Infra pvt ltd",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/277764296_364863552320122_1313778546954450163_n-removebg-preview.webp",
    fallbackAcronym: "UI",
    description: "Premier real estate developers designing sustainable residential ecosystems with a customer-first focus.",
    industry: "Residential Development",
    prominentProject: "Universal Elite Estates"
  },
  {
    id: "pgc",
    name: "PGC",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/WhatsApp_Image_2024-09-06_at_4.16.19_PM-removebg-preview.webp",
    fallbackAcronym: "PGC",
    description: "Eminent building and construction contractor erecting durable multi-storey towers and civic assets.",
    industry: "Civil Construction Services",
    prominentProject: "PGC Commercial Hub"
  },
  {
    id: "anjana",
    name: "Anjana",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/Anjana_Resort_X3OtF4h.webp",
    fallbackAcronym: "AH",
    description: "High-end boutique hospitality providers blending heritage Indian design with luxury ecological resort lounges.",
    industry: "Hospitality & Tourism",
    prominentProject: "Anjna Hotels & Resort (Barkheda)"
  },
  {
    id: "green-mountain-resort",
    name: "Green Mountain Resort",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/Green_mountains_resort.webp",
    fallbackAcronym: "GMR",
    description: "Elite ecotourism hospitality providers hosting beautiful nature-immersed eco-resort retreats.",
    industry: "Eco-Hospitality",
    prominentProject: "Green Mountain Sanctuary"
  },
  {
    id: "iris-group",
    name: "IRIS Group",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/iris_leaf_fmpFF6J.webp",
    fallbackAcronym: "IRIS",
    description: "Modern architectural and development consortium creating premium urban spaces.",
    industry: "Urban Infrastructure",
    prominentProject: "IRIS Office Suites"
  },
  {
    id: "krishnani-developers",
    name: "Krishnani Developers",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/KRISHNANI_DEVELOPERS.webp",
    fallbackAcronym: "KD",
    description: "Township creators specializing in modern residential sectors and master-planned sub-divisions.",
    industry: "Real Estate Infrastructure",
    prominentProject: "Krishnani Prime Enclave"
  },
  {
    id: "malpani-group",
    name: "Malpani Group",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/malpani_group.webp",
    fallbackAcronym: "MG",
    description: "Multi-sector conglomerate engineering state-of-the-art office spaces and corporate towers.",
    industry: "Corporate Real Estate",
    prominentProject: "Malpani Business Park"
  },
  {
    id: "orion-park",
    name: "Orion Park",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/orion_parkk.webp",
    fallbackAcronym: "OP",
    description: "Pioneers of pedestrian-friendly high-density business hubs and landscaped retail plazas.",
    industry: "Commercial Townships",
    prominentProject: "Orion Commercial Park"
  },
  {
    id: "palm-island",
    name: "Palm Island",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/Palm_island.webp",
    fallbackAcronym: "PI",
    description: "Luxury getaway designers crafting exotic coastal, lakeside, and forest resort centers.",
    industry: "Luxury Living & Resorts",
    prominentProject: "Palm Island Eco-Resort"
  },
  {
    id: "takshit-infratech",
    name: "Takshit Infratech Pvt. Ltd.",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/takshit_infratech.webp",
    fallbackAcronym: "TI",
    description: "Highly trusted civil engineering firm committed to constructing durable, environment-conscious civic developments.",
    industry: "Civil Infrastructure",
    prominentProject: "Takshit Smart Enclave"
  },
  {
    id: "vk-gupta-group",
    name: "VK Gupta Group",
    logoUrl: "https://earthfirmarchitects.com/media/clients_images/vkg_group.webp",
    fallbackAcronym: "VKG",
    description: "Pioneering real estate enterprise behind major commercial acquisitions and high-value residential projects.",
    industry: "Real Estate & Investments",
    prominentProject: "VKG Commercial Hub"
  }
];

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "v1",
    name: "Vikram Singhania",
    role: "MD & Developer",
    project: "Landmark Greens",
    quote: "The thermal passive cooling keeps the indoor temperature beautifully balanced. Our residents live in complete acoustic quietude.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-architect-office-with-blueprint-view-on-desk-40237-large.mp4",
    avatar: "https://earthfirmarchitects.com/media/client_images/testi-01.webp"
  },
  {
    id: "v2",
    name: "Ananya Sen",
    role: "Chief Curator",
    project: "Anjna Hotels & Resort",
    quote: "By sourcing local basalt and reclaim teakwood, Earthfirm integrated our flagship resort seamlessly with the surrounding landscape.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-as-an-architect-40244-large.mp4",
    avatar: "https://earthfirmarchitects.com/media/clients_images/Anjana_Resort_X3OtF4h.webp"
  },
  {
    id: "v3",
    name: "Rajesh Malhotra",
    role: "VP Urban Planning",
    project: "Kalindi Smart City",
    quote: "They implemented incredibly robust sustainable water recycling systems without compromising an inch on visual majesty.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-architects-discussing-a-project-over-desktop-39958-large.mp4",
    avatar: "https://earthfirmarchitects.com/media/clients_images/kalindi-logo_uNZLDjH.webp"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which material palette resonates with your calmest state?",
    options: [
      {
        text: "Clean raw concrete with hints of tarnished bronze and sleek glass.",
        style: "earth-brutalist",
        image: "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_NmadhPN.webp"
      },
      {
        text: "Warm solid oak, exposed stone, living plant walls, and organic linen.",
        style: "biophilic",
        image: "https://earthfirmarchitects.com/media/project_images/Untitled_design.webp"
      },
      {
        text: "Brushed metals, dark textured slate, brick elements, and sleek leather.",
        style: "industrial",
        image: "https://earthfirmarchitects.com/media/project_images/0_SpPW4mH.webp"
      },
      {
        text: "Pure white travertine, frameless glass, soft beige textures, and ultimate silence.",
        style: "minimalist",
        image: "https://earthfirmarchitects.com/media/project_images/0_0Lhn5oK.webp"
      }
    ]
  },
  {
    id: 2,
    question: "How do you prefer your space to interact with lighting?",
    options: [
      {
        text: "Massive clerestory windows letting deep ambient sunlight illuminate raw walls.",
        style: "earth-brutalist",
        image: "https://earthfirmarchitects.com/media/project_images/0_7RPB60M.webp"
      },
      {
        text: "A central sun-lit sky atrium with indoor trees feeding on cascading sunlight.",
        style: "biophilic",
        image: "https://earthfirmarchitects.com/media/project_images/0_vOqy0UP.webp"
      },
      {
        text: "High contrast lighting, architectural spotlight tracks, and metal floor lamps.",
        style: "industrial",
        image: "https://earthfirmarchitects.com/media/project_images/cabin_2.webp"
      },
      {
        text: "Indirect diffused linear cove lights recessed secretly into clean architectural planes.",
        style: "minimalist",
        image: "https://earthfirmarchitects.com/media/project_images/0_Ezi1XRS.webp"
      }
    ]
  },
  {
    id: 3,
    question: "What is your primary design priority for your ideal property?",
    options: [
      {
        text: "Imposing architectural lines and structural gravity that outlasts centuries.",
        style: "earth-brutalist",
        image: "https://earthfirmarchitects.com/media/project_images/1_1_-_Photo_2_ojTMdHF.webp"
      },
      {
        text: "A seamless transition where inside and outside boundaries disappear into botanical foliage.",
        style: "biophilic",
        image: "https://earthfirmarchitects.com/media/project_images/0.webp"
      },
      {
        text: "Optimized functional resilience, high-tech controls, and raw modularity.",
        style: "industrial",
        image: "https://earthfirmarchitects.com/media/project_images/1_2_-_Photo_v9OEONX.webp"
      },
      {
        text: "Absolute absence of visual clutter, offering complete mental recovery space.",
        style: "minimalist",
        image: "https://earthfirmarchitects.com/media/project_images/11_14_-_Photo.webp"
      }
    ]
  }
];

export const STYLE_PROFILES = {
  biophilic: {
    title: "Modern Biophilic",
    description: "You thrive where nature breeds. Your lifestyle values organic flora, lightwells, clean hydration points, and seamless hardwood pathways that invite the surrounding gardens indoors.",
    matchingProjects: ["landmark-greens", "springfield-row-house"],
    architecturalTip: "Include an indoor tree well or zero-edge landscape reflection pond to ground your morning meditation space."
  },
  minimalist: {
    title: "Zen Minimalist",
    description: "For you, design comes from subtraction. You seek absolute peace of mind through hidden storage, recessed ambient lighting, continuous natural travertine planes, and zero visual noise.",
    matchingProjects: ["kalindi-smart-city"],
    architecturalTip: "Incorporate handle-less walnut cabinetry spanning entire walls to hide high-density storage seamlessly."
  },
  industrial: {
    title: "Tectonic Industrial",
    description: "You appreciate functional mechanics and structural honesty. Your aesthetic is rooted in metallic beams, cast-iron accents, exposed custom brickwork surfaces, and highly dynamic open plans.",
    matchingProjects: ["anjna-resort"],
    architecturalTip: "Utilize custom powder-coated steel space dividers and oversized steel sash pivoting doors to create raw elegance."
  },
  "earth-brutalist": {
    title: "Earth-Sheltered Brutalist",
    description: "You value permanence, weight, and shelter. You love heavy textured walls, monumental geometries, deeply recessed light slits, and cast concrete that acquires beautiful ancient lichen patina.",
    matchingProjects: ["landmark-greens", "anjna-resort"],
    architecturalTip: "Blend board-formed raw concrete with warm copper hardware to balance structural coldness with cozy internal warmth."
  }
};
