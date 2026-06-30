import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    accent: "#00D4AA",
    bg: "bg-[#0f2a24]",
    border: "border-[#00D4AA]/40",
    iconColor: "text-[#00D4AA]",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    accent: "#FF4D6D",
    bg: "bg-[#2a0f15]",
    border: "border-[#FF4D6D]/40",
    iconColor: "text-[#FF4D6D]",
    label: "Error",
  },
  info: {
    icon: Info,
    accent: "#6C63FF",
    bg: "bg-[#16143a]",
    border: "border-[#6C63FF]/40",
    iconColor: "text-[#6C63FF]",
    label: "Info",
  },
  warning: {
    icon: AlertTriangle,
    accent: "#FFB347",
    bg: "bg-[#2a1f0f]",
    border: "border-[#FFB347]/40",
    iconColor: "text-[#FFB347]",
    label: "Advertencia",
  },
};

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

let idCounter = 0;

function generateId() {
  return `toast_${++idCounter}_${Date.now()}`;
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const Icon = config.icon;

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    clearTimeout(timerRef.current);
    setTimeout(() => onRemove(toast.id), 350);
  }, [leaving, onRemove, toast.id]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 20);
    timerRef.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timerRef.current);
    };
  }, []);

  const progressDuration = AUTO_DISMISS_MS;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-3 w-full max-w-sm
        rounded-xl border px-4 py-3 shadow-2xl
        ${config.bg} ${config.border}
        transition-all duration-350 ease-out
        ${visible && !leaving
          ? "opacity-100 translate-x-0 scale-100"
          : leaving
          ? "opacity-0 translate-x-8 scale-95"
          : "opacity-0 translate-x-8 scale-95"
        }
      `}
      style={{
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${config.accent}22`,
        transitionProperty: "opacity, transform",
      }}
    >
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] rounded-b-xl"
        style={{
          backgroundColor: config.accent,
          animation: `toast-progress ${progressDuration}ms linear forwards`,
          width: "100%",
        }}
      />

      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
        <Icon size={18} strokeWidth={2.2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-0.5"
            style={{ color: config.accent }}
          >
            {toast.title || config.label}
          </p>
        )}
        <p className="text-sm text-gray-200 leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Cerrar notificación"
        className="flex-shrink-0 mt-0.5 p-0.5 rounded-md text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-colors duration-150"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "info", title }) => {
      if (!message) return;
      const id = generateId();
      setToasts((prev) => {
        const next = [...prev, { id, message, type, title }];
        return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
      });
      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, title) => addToast({ message, type: "success", title }),
    [addToast]
  );
  const error = useCallback(
    (message, title) => addToast({ message, type: "error", title }),
    [addToast]
  );
  const info = useCallback(
    (message, title) => addToast({ message, type: "info", title }),
    [addToast]
  );
  const warning = useCallback(
    (message, title) => addToast({ message, type: "warning", title }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, success, error, info, warning }}
    >
      {children}

      {/* Toast container */}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3 items-end pointer-events-none"
        style={{ maxWidth: "calc(100vw - 2rem)" }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}

export default ToastProvider;