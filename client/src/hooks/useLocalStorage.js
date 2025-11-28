import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useLocalStorageState = (key, initialState) => {
  const [state, setState] = useLocalStorage(key, initialState);

  const updateState = (newState) => {
    setState((prevState) => ({
      ...prevState,
      ...(newState instanceof Function ? newState(prevState) : newState),
    }));
  };

  return [state, updateState];
};

export const useLocalStorageArray = (key, initialArray = []) => {
  const [array, setArray] = useLocalStorage(key, initialArray);

  const addItem = (item) => {
    setArray((prev) => [...prev, item]);
  };

  const removeItem = (index) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, newItem) => {
    setArray((prev) => prev.map((item, i) => (i === index ? newItem : item)));
  };

  const clearArray = () => {
    setArray([]);
  };

  return {
    array,
    setArray,
    addItem,
    removeItem,
    updateItem,
    clearArray,
  };
};

export const useLocalStorageObject = (key, initialObject = {}) => {
  const [object, setObject] = useLocalStorage(key, initialObject);

  const updateObject = (updates) => {
    setObject((prev) => ({
      ...prev,
      ...(updates instanceof Function ? updates(prev) : updates),
    }));
  };

  const removeKey = (keyToRemove) => {
    setObject((prev) => {
      const { [keyToRemove]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearObject = () => {
    setObject({});
  };

  return {
    object,
    setObject,
    updateObject,
    removeKey,
    clearObject,
  };
};

export default useLocalStorage; 