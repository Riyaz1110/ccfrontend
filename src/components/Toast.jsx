import { useState, useEffect } from 'react';

let toastFn;

export const showToast = (message, type = 'success') => {
  if (toastFn) toastFn(message, type);
};

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    toastFn = (message, type) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    };
    return () => { toastFn = null; };
  }, []);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === 'success' ? '✓ ' : '✕ '}
      {toast.message}
    </div>
  );
}
