import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g. search term, filter inputs)
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default 350ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 350) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;

