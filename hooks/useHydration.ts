import { useState, useEffect } from 'react';

/**
 * Custom hook to handle hydration properly and prevent hydration mismatches
 * This ensures that the component only renders on the client side after hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    isClient,
    isHydrated,
    isReady: isClient && isHydrated,
  };
}

/**
 * Hook to safely access browser APIs without causing hydration mismatches
 */
export function useBrowserAPI() {
  const { isReady } = useHydration();
  
  return {
    isReady,
    // Safe access to browser APIs
    window: isReady ? window : undefined,
    document: isReady ? document : undefined,
    localStorage: isReady ? localStorage : undefined,
    sessionStorage: isReady ? sessionStorage : undefined,
  };
}

/**
 * Hook to handle dynamic imports safely
 */
export function useDynamicImport() {
  const { isReady } = useHydration();
  
  const safeImport = async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    if (!isReady) {
      return null;
    }
    
    try {
      return await importFn();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      return null;
    }
  };
  
  return {
    isReady,
    safeImport,
  };
}
