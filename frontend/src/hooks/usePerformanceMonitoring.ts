import { useEffect } from 'react';

const PERFORMANCE_THRESHOLD = 3000; // 3 seconds

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Monitor page load performance
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > PERFORMANCE_THRESHOLD) {
            console.warn(`🐌 Slow operation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });

      // Monitor initial app load time
      const startTime = performance.now();
      
      const checkLoadTime = () => {
        const loadTime = performance.now() - startTime;
        if (loadTime > PERFORMANCE_THRESHOLD) {
          console.warn(`🐌 App took ${loadTime.toFixed(2)}ms to load (threshold: ${PERFORMANCE_THRESHOLD}ms)`);
        } else {
          console.log(`✅ App loaded in ${loadTime.toFixed(2)}ms`);
        }
      };

      // Check when DOM is ready
      if (document.readyState === 'complete') {
        checkLoadTime();
      } else {
        window.addEventListener('load', checkLoadTime);
      }

      return () => {
        observer.disconnect();
        window.removeEventListener('load', checkLoadTime);
      };
    }
  }, []);
};

export default usePerformanceMonitoring;