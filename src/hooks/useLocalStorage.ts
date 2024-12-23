import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
		  const item = localStorage.getItem(key);
		  return item ? JSON.parse(item) : initialValue;
		} catch (error) {
		  console.error("Failed to parse localStorage item:", error);
		  return initialValue;
		}
	  });
	
	  const setValue = (value: T) => {
		try {
		  localStorage.setItem(key, JSON.stringify(value));
		  setStoredValue(value);
		} catch (error) {
		  console.error("Failed to set localStorage item:", error);
		}
	  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        const item = localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      }
    };

    const handleCustomEvent = (e: Event) => {
		const event = e as CustomEvent<{ key: string }>;
		console.log("CustomEvent caught:", event.detail.key);
		if (event.detail.key === key) {
		  const item = localStorage.getItem(key);
		  setStoredValue(item ? JSON.parse(item) : initialValue);
		}
	  };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleCustomEvent);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
};
