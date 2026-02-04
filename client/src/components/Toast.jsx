import { useState, useEffect, useRef } from "react";

export default function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 sm:gap-3 max-w-[calc(100vw-2rem)] sm:max-w-md pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} removeToast={removeToast} />
            ))}
        </div>
    );
}

function Toast({ toast, removeToast }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const DURATION = 1000; // 1 second

  const dismiss = () => {
    setExiting(true);
    clearInterval(intervalRef.current);
    setTimeout(() => removeToast(toast.id), 250); // exit animation
  };

  useEffect(() => {
    const start = Date.now();

    // auto dismiss
    timeoutRef.current = setTimeout(dismiss, DURATION);

    // progress bar
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
    }, 16);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [toast.id]);

  const typeConfig = {
    success: { bg: "from-green-500 to-emerald-600", bar: "bg-green-300" },
    error: { bg: "from-red-500 to-rose-600", bar: "bg-red-300" },
    warning: { bg: "from-amber-500 to-orange-500", bar: "bg-amber-300" },
    info: { bg: "from-blue-500 to-indigo-600", bar: "bg-blue-300" }
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-lg shadow-xl transform transition-all duration-300
        ${exiting ? "translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100"}
      `}
      role="alert"
    >
      {/* Content */}
      <div
        className={`bg-gradient-to-r ${config.bg} text-white px-3 py-2 flex items-center gap-2 text-sm min-w-[240px]`}
      >
        <span className="flex-1 leading-snug">{toast.message}</span>

        <button
          onClick={dismiss}
          className="opacity-80 hover:opacity-100 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Progress */}
      <div className="h-0.5 bg-black/20">
        <div
          className={`${config.bar} h-full transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
