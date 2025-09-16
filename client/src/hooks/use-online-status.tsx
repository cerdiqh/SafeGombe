import React, { createContext, useContext, useEffect, useState } from 'react';

type OnlineStatusContextType = {
  isOnline: boolean;
};

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

type OnlineStatusProviderProps = {
  children: React.ReactNode;
};

export const OnlineStatusProvider = ({ children }: OnlineStatusProviderProps) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = (): OnlineStatusContextType => {
  const context = useContext(OnlineStatusContext);
  
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider');
  }
  
  return context;
};
