import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type ToastType = "info" | "success" | "error";

type Toast = {
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const alertClasses: Record<ToastType, string> = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast toast-end">
          <div role="alert" className={`alert ${alertClasses[toast.type]}`}>
            <span className={"font-bold"}>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
