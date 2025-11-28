import { useEffect, useCallback } from 'react';

const useKeyboardShortcut = (keyCombo, callback, options = {}) => {
  const {
    preventDefault = true,
    enabled = true,
    keyEvent = 'keydown',
  } = options;

  const handleKeyPress = useCallback(
    (event) => {
      if (!enabled) return;

      const keys = keyCombo.toLowerCase().split('+');
      const pressedKey = event.key.toLowerCase();

      const modifiers = {
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
      };

      const modifierKeys = ['ctrl', 'shift', 'alt', 'meta'];
      const requiredModifiers = keys.filter(key => modifierKeys.includes(key));
      const requiredKey = keys.find(key => !modifierKeys.includes(key));

      const modifiersMatch = requiredModifiers.every(modifier => modifiers[modifier]) &&
        modifierKeys.every(modifier => !modifiers[modifier] || requiredModifiers.includes(modifier));

      if (modifiersMatch && pressedKey === requiredKey) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [keyCombo, callback, enabled, preventDefault]
  );

  useEffect(() => {
    document.addEventListener(keyEvent, handleKeyPress);
    return () => document.removeEventListener(keyEvent, handleKeyPress);
  }, [keyEvent, handleKeyPress]);
};

export const useKeyPress = (targetKey, callback, options = {}) => {
  const {
    preventDefault = true,
    enabled = true,
    keyDownEvent = true,
    keyUpEvent = false,
  } = options;

  const handleKey = useCallback(
    (event) => {
      if (!enabled) return;
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [targetKey, callback, enabled, preventDefault]
  );

  useEffect(() => {
    if (keyDownEvent) {
      document.addEventListener('keydown', handleKey);
    }
    if (keyUpEvent) {
      document.addEventListener('keyup', handleKey);
    }

    return () => {
      if (keyDownEvent) {
        document.removeEventListener('keydown', handleKey);
      }
      if (keyUpEvent) {
        document.removeEventListener('keyup', handleKey);
      }
    };
  }, [keyDownEvent, keyUpEvent, handleKey]);
};

export const useEscapeKey = (callback) => {
  useKeyPress('Escape', callback);
};

export const useEnterKey = (callback) => {
  useKeyPress('Enter', callback);
};

export default useKeyboardShortcut; 