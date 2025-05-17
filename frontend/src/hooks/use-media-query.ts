import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Update the state with the current value
    const listener = () => setMatches(media.matches);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Add listener for changes
    media.addEventListener('change', listener);
    
    // Clean up
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
