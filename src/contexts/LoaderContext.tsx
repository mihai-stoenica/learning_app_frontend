import { createContext, useContext, useState } from "react";

const LoaderContext = createContext<{
  loading: boolean;
  setLoading: (val: boolean) => void;
} | null>(null);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <div className="loading loading-dots loading-xl" />
        </div>
      )}
    </LoaderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used within LoaderProvider");
  return ctx;
};
