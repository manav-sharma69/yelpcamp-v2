'use client';
import React from 'react';
import useKeydown from '@/utils/hooks/use-keydown';
export const ToastContext = React.createContext();


function ToastProvider({children}) {
  const [toasts, setToasts] = React.useState([]);
  const [duration, setDuration] = React.useState(5000);

  const handleEscape = React.useCallback(() => {
    setToasts([]);
  }, []);

  useKeydown('Escape', handleEscape);

  function dismissToast(toastId){
    let nextToast = toasts.filter(({id}) => id !== toastId );
    setToasts(nextToast);
  }
 
  function createToast(msg, variant){
    let nextToast = [...toasts, {variant, message: msg, id: crypto.randomUUID()}];
    setToasts(nextToast);
  }

  const value = {toasts, duration, setDuration, dismissToast, createToast};

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
