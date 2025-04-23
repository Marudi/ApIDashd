
import { createContext, useContext, useEffect, useState } from "react";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";

interface DemoDataContextType {
  showDemoData: boolean;
  setShowDemoData: (value: boolean) => void;
}

const DemoDataContext = createContext<DemoDataContextType>({
  showDemoData: true,
  setShowDemoData: () => {},
});

export const DemoDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { persistentEnabled, getPersistentItem } = usePersistentStorage();
  const [showDemoData, setShowDemoData] = useState(true);

  useEffect(() => {
    if (persistentEnabled) {
      const settings = getPersistentItem("dashboard_settings");
      if (settings && settings.showDemoData !== undefined) {
        setShowDemoData(settings.showDemoData);
      }
    }
  }, [persistentEnabled, getPersistentItem]);

  return (
    <DemoDataContext.Provider value={{ showDemoData, setShowDemoData }}>
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => useContext(DemoDataContext);
