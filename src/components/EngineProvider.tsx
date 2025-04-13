"use client";

import { createContext, useState } from "react";

export interface ActiveEngine {
  engineId: string;
  setEngineId: (arg0: string) => void;
}
export const ActiveEngineContext = createContext<ActiveEngine | undefined>(
  undefined,
);

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const [engineId, setEngineId] = useState("");
  return (
    <ActiveEngineContext.Provider value={{ engineId, setEngineId }}>
      {children}
    </ActiveEngineContext.Provider>
  );
}
