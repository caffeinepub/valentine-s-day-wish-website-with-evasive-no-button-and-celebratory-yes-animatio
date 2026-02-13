import { useState, useCallback, useEffect, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseEvasiveButtonOptions {
  containerRef: RefObject<HTMLElement | null>;
  yesButtonRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

export function useEvasiveButton({ containerRef, yesButtonRef, enabled = true }: UseEvasiveButtonOptions) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hasEscaped, setHasEscaped] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const calculateSafePosition = useCallback((): Position => {
    if (!containerRef.current || !yesButtonRef.current) {
      return { x: 0, y: 0 };
    }

    const container = containerRef.current.getBoundingClientRect();
    const yesButton = yesButtonRef.current.getBoundingClientRect();
    
    const buttonWidth = 120;
    const buttonHeight = 48;
    const padding = 20;
    const yesButtonPadding = 40;

    const maxX = container.width - buttonWidth - padding;
    const maxY = container.height - buttonHeight - padding;

    let newX: number;
    let newY: number;
    let attempts = 0;
    const maxAttempts = 20;

    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      attempts++;

      const noButtonRect = {
        left: newX,
        right: newX + buttonWidth,
        top: newY,
        bottom: newY + buttonHeight,
      };

      const yesButtonRelative = {
        left: yesButton.left - container.left,
        right: yesButton.right - container.left,
        top: yesButton.top - container.top,
        bottom: yesButton.bottom - container.top,
      };

      const overlapsYes = !(
        noButtonRect.right + yesButtonPadding < yesButtonRelative.left ||
        noButtonRect.left - yesButtonPadding > yesButtonRelative.right ||
        noButtonRect.bottom + yesButtonPadding < yesButtonRelative.top ||
        noButtonRect.top - yesButtonPadding > yesButtonRelative.bottom
      );

      if (!overlapsYes) {
        break;
      }
    } while (attempts < maxAttempts);

    return { x: newX, y: newY };
  }, [containerRef, yesButtonRef]);

  const handleEscape = useCallback(() => {
    if (!enabled || prefersReducedMotion) return;
    
    const newPosition = calculateSafePosition();
    setPosition(newPosition);
    setHasEscaped(true);
  }, [enabled, prefersReducedMotion, calculateSafePosition]);

  const handleMouseEnter = useCallback(() => {
    handleEscape();
  }, [handleEscape]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (hasEscaped) return;
    e.preventDefault();
    handleEscape();
  }, [hasEscaped, handleEscape]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!prefersReducedMotion) {
      e.preventDefault();
      handleEscape();
    }
  }, [prefersReducedMotion, handleEscape]);

  return {
    position,
    hasEscaped,
    prefersReducedMotion,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onTouchStart: handleTouchStart,
      onClick: handleClick,
    },
  };
}
