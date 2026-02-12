import { useState, useCallback, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useEvasiveButton(
  containerRef: RefObject<HTMLElement | null>,
  buttonRef: RefObject<HTMLElement | null>
) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const moveButton = useCallback(() => {
    if (!containerRef.current || !buttonRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    // Calculate safe bounds (with padding)
    const padding = 20;
    const maxX = container.width - button.width - padding * 2;
    const maxY = container.height - button.height - padding * 2;

    // Generate random position within bounds
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setPosition({ x: newX, y: newY });
  }, [containerRef, buttonRef]);

  return { position, moveButton };
}
