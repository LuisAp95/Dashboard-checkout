import React, { useRef, useEffect } from "react";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  opacity: number;
  exploding?: boolean;
}

const BubbleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const bubbles = useRef<Bubble[]>([]);

  const createBubble = (): Bubble => {
    const radius = Math.random() * 30 + 20;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.3 + 0.4,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bubbles.current = Array.from({ length: 30 }, createBubble);
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.current.forEach((bubble, index) => {
        // Si explota, reducir radio y opacidad
        if (bubble.exploding) {
          bubble.radius *= 0.92;
          bubble.opacity *= 0.9;
          if (bubble.radius < 2 || bubble.opacity < 0.05) {
            bubbles.current[index] = createBubble(); // reemplazar por nueva burbuja
            return;
          }
        } else {
          // Movimiento normal
          bubble.x += bubble.dx + (mouse.current.x - bubble.x) * 0.0002;
          bubble.y += bubble.dy + (mouse.current.y - bubble.y) * 0.0002;

          if (
            bubble.x - bubble.radius < 0 ||
            bubble.x + bubble.radius > canvas.width
          )
            bubble.dx *= -1;
          if (
            bubble.y - bubble.radius < 0 ||
            bubble.y + bubble.radius > canvas.height
          )
            bubble.dy *= -1;
        }

        // Gradiente visual
        const gradient = ctx.createRadialGradient(
          bubble.x,
          bubble.y,
          bubble.radius * 0.3,
          bubble.x,
          bubble.y,
          bubble.radius
        );
        gradient.addColorStop(0, `rgba(151, 138, 145, ${bubble.opacity})`);
        gradient.addColorStop(1, `rgba(151, 138, 145)`);

        // gradient.addColorStop(0, `rgba(173, 216, 230, ${bubble.opacity})`);
        // gradient.addColorStop(1, `rgba(100, 200, 255)`);

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      initCanvas();
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      bubbles.current.forEach((bubble) => {
        const dx = bubble.x - clickX;
        const dy = bubble.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= bubble.radius) {
          bubble.exploding = true;
        }
      });
    };

    initCanvas();
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-[1] pointer-events-auto"
    />
  );
};

export default BubbleBackground;
