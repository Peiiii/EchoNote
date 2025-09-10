import { useState, useEffect } from "react";

export const useMobileViewportHeight = () => {
    const [viewportHeight, setViewportHeight] = useState<string>('100vh');
    
    useEffect(() => {
        const updateViewportHeight = () => {
            const newHeight = `${window.innerHeight}px`;
            setViewportHeight(newHeight);
            
            // Set CSS custom property for global use
            document.documentElement.style.setProperty('--mobile-vh', newHeight);
        };

        // Initial setup
        updateViewportHeight();

        // Event listeners for different viewport change scenarios
        const events = ['resize', 'orientationchange'] as const;
        events.forEach(event => {
            window.addEventListener(event, updateViewportHeight);
        });

        // Chrome mobile specific: visual viewport API
        if ('visualViewport' in window && window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewportHeight);
        }

        // Cleanup function
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateViewportHeight);
            });
            
            if ('visualViewport' in window && window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateViewportHeight);
            }
        };
    }, []);

    return viewportHeight;
};
