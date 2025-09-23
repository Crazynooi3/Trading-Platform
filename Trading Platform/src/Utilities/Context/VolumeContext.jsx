// VolumeContext.jsx
import React, { createContext, useContext, useState } from "react";

const VolumeContext = createContext();

export function VolumeProvider({ children }) {
  const [totalVolumes, setTotalVolumes] = useState({ ask: 0, bid: 0 });

  return (
    <VolumeContext.Provider value={{ totalVolumes, setTotalVolumes }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  return useContext(VolumeContext);
}
