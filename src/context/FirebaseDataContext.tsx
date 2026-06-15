import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, Testimonial, Client, VideoTestimonial } from "../types";

interface FirebaseData {
  projects: Project[];
  testimonials: Testimonial[];
  clients: Client[];
  videoTestimonials: VideoTestimonial[];
  loading: boolean;
}

const FirebaseDataContext = createContext<FirebaseData>({
  projects: [],
  testimonials: [],
  clients: [],
  videoTestimonials: [],
  loading: true,
});

export const FirebaseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FirebaseData>({
    projects: [],
    testimonials: [],
    clients: [],
    videoTestimonials: [],
    loading: true,
  });

  useEffect(() => {
    let projectsLoaded = false;
    let testimonialsLoaded = false;
    let clientsLoaded = false;
    let vTestimonialsLoaded = false;

    const checkAllLoaded = () => {
      if (projectsLoaded && testimonialsLoaded && clientsLoaded && vTestimonialsLoaded) {
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      console.log("FirebaseDataContext snapshot update for projects:", items.length);
      setData(prev => ({ ...prev, projects: items }));
      projectsLoaded = true;
      checkAllLoaded();
    });
    
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setData(prev => ({ ...prev, testimonials: items }));
      testimonialsLoaded = true;
      checkAllLoaded();
    });
    
    const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setData(prev => ({ ...prev, clients: items }));
        clientsLoaded = true;
        checkAllLoaded();
    });

    const unsubVTestimonials = onSnapshot(collection(db, 'videoTestimonials'), (snap) => {
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoTestimonial));
        setData(prev => ({ ...prev, videoTestimonials: items }));
        vTestimonialsLoaded = true;
        checkAllLoaded();
    });

    return () => {
      unsubProjects();
      unsubTestimonials();
      unsubClients();
      unsubVTestimonials();
    };
  }, []);

  return (
    <FirebaseDataContext.Provider value={data}>
      {children}
    </FirebaseDataContext.Provider>
  );
};

export const useFirebaseData = () => useContext(FirebaseDataContext);
