"use client";

import { createContext, useState } from "react";

/**
 * Type of engine data to track active engine using useState hook
 *
 * @property engineId - ID of the active engine
 * @property setEngineId - setter function to set the active engine ID.
 */
export interface ActiveEngine {
  engineId: string;
  setEngineId: (arg0: string) => void;
}
export const ActiveEngineContext = createContext<ActiveEngine | undefined>(
  undefined,
);

/**
 * Provider component for active engine state context
 */
export function EngineProvider({ children }: { children: React.ReactNode }) {
  const [engineId, setEngineId] = useState("");
  return (
    <ActiveEngineContext.Provider value={{ engineId, setEngineId }}>
      {children}
    </ActiveEngineContext.Provider>
  );
}
