
import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export const useRateLimit = ({ maxAttempts, windowMs }: RateLimitConfig) => {
  const [attempts, setAttempts] = useState<number[]>([]);

  const isAllowed = useCallback((): boolean => {
    const now = Date.now();
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    setAttempts(recentAttempts);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    setAttempts(prev => [...prev, now]);
    return true;
  }, [attempts, maxAttempts, windowMs]);

  const getRemainingTime = useCallback((): number => {
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeUntilReset);
  }, [attempts, windowMs]);

  return {
    isAllowed,
    getRemainingTime,
    attemptsCount: attempts.length
  };
};
