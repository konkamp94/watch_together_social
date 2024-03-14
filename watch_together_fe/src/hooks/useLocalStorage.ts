import { useState } from 'react';

const useLocalStorage = (key: string): [(string | null), ((value: string) => void), ((value: string) => void)] => {

    const [storedValue, setStoredValue] = useState(() => {
        const item = window.localStorage.getItem(key);
        return item
    });

    const setValue = (value: string) => {
        window.localStorage.setItem(key, value);
        setStoredValue(value);
    };

    const removeValue = (key: string) => {
        window.localStorage.removeItem(key);
        setStoredValue(null);
    }

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;