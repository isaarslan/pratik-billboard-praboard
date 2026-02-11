import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [stack, setStack] = useState([{ name: 'Onboarding', params: {} }]);

  const navigate = useCallback((name, params = {}) => {
    setStack((prev) => [...prev, { name, params }]);
  }, []);

  const replace = useCallback((name, params = {}) => {
    setStack((prev) => {
      const newStack = prev.length > 1 ? prev.slice(0, -1) : [];
      return [...newStack, { name, params }];
    });
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = useCallback((name, params = {}) => {
    setStack([{ name, params }]);
  }, []);

  const currentRoute = stack[stack.length - 1];

  const navigation = {
    navigate,
    replace,
    goBack,
    reset,
    currentRoute,
  };

  return (
    <NavigationContext.Provider value={navigation}>
      {typeof children === 'function' ? children(navigation) : children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const nav = useContext(NavigationContext);
  if (!nav) throw new Error('useNavigation must be used within NavigationProvider');
  return nav;
}
