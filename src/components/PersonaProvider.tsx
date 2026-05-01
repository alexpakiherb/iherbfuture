'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PERSONAS, Persona, PersonaId } from '@/data/personas';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

interface PersonaContextValue {
  persona: Persona;
  personaId: PersonaId;
  setPersonaId: (id: PersonaId) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (t: TimeOfDay) => void;
  greeting: string;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

const STORAGE_KEY_PERSONA = 'iherb-wellness-persona';
const STORAGE_KEY_TIME = 'iherb-wellness-time';

function detectTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personaId, setPersonaIdState] = useState<PersonaId>('maya');
  const [timeOfDay, setTimeOfDayState] = useState<TimeOfDay>('morning');
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedPersona = window.localStorage.getItem(STORAGE_KEY_PERSONA) as PersonaId | null;
    const storedTime = window.localStorage.getItem(STORAGE_KEY_TIME) as TimeOfDay | null;
    if (storedPersona && (storedPersona === 'maya' || storedPersona === 'daniel')) {
      setPersonaIdState(storedPersona);
    }
    if (storedTime && (storedTime === 'morning' || storedTime === 'afternoon' || storedTime === 'evening')) {
      setTimeOfDayState(storedTime);
    } else {
      setTimeOfDayState(detectTimeOfDay());
    }
    setHydrated(true);
  }, []);

  const setPersonaId = useCallback((id: PersonaId) => {
    setPersonaIdState(id);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY_PERSONA, id);
  }, []);

  const setTimeOfDay = useCallback((t: TimeOfDay) => {
    setTimeOfDayState(t);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY_TIME, t);
  }, []);

  const persona = PERSONAS[personaId];
  const greeting = persona.greetingByTime[timeOfDay];

  const value = useMemo<PersonaContextValue>(
    () => ({ persona, personaId, setPersonaId, timeOfDay, setTimeOfDay, greeting }),
    [persona, personaId, setPersonaId, timeOfDay, setTimeOfDay, greeting]
  );

  // Avoid SSR/CSR mismatch flicker by only rendering once hydrated
  if (!hydrated) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
