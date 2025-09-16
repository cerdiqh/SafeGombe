import * as React from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);

  const toast = React.useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((currentToasts: Array<ToastProps & { id: string }>) => [...currentToasts, { id, title, description, variant }]);
    
    setTimeout(() => {
      setToasts((currentToasts: Array<ToastProps & { id: string }>) => 
        currentToasts.filter((t: { id: string }) => t.id !== id)
      );
    }, 5000);
  }, []);

  const toastElements = React.useMemo(() => {
    return toasts.map(({ id, title, description, variant }) => (
      <div
        key={id}
        style={{
          padding: '1rem',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          minWidth: '300px',
          maxWidth: '24rem',
          backgroundColor: variant === 'destructive' ? '#FEE2E2' : '#FFFFFF',
          border: `1px solid ${variant === 'destructive' ? '#FECACA' : '#E5E7EB'}`,
          color: variant === 'destructive' ? '#991B1B' : '#1F2937'
        }}
      >
        <div style={{ fontWeight: 500 }}>{title}</div>
        {description && (
          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {description}
          </div>
        )}
      </div>
    ));
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div 
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        {toastElements}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
