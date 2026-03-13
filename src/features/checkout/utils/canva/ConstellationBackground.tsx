import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  speed: number;
  connections: number[];
  angle: number; // Ángulo actual de la órbita
  orbitRadius: number; // Radio de la órbita
  angularSpeed: number; // Velocidad angular
  centerX: number; // Centro de la órbita (posición inicial X)
  centerY: number; // Centro de la órbita (posición inicial Y)
}

const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuración
    const config = {
      starCount: window.innerWidth < 768 ? 50 : 200, // Menos estrellas en móvil
      connectionDistance: window.innerWidth < 768 ? 100 : 200, // Menor distancia en móvil
      lineOpacity: 0.2,
      starColor: "#222222",
      nebulaColor1: "rgba(100, 70, 150, 0.1)",
      nebulaColor2: "rgba(30, 50, 120, 0.1)",
    };

    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Actualizar configuración basada en el tamaño de pantalla
      config.starCount = window.innerWidth < 768 ? 50 : 200;
      config.connectionDistance = window.innerWidth < 768 ? 100 : 200;

      initStars();
    };

    // Inicializar estrellas
    const initStars = () => {
      const stars: Star[] = [];

      for (let i = 0; i < config.starCount; i++) {
        // Posición inicial aleatoria
        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * canvas.height;
        // Radio de órbita más grande para que el giro sea visible
        const orbitRadius = 20 + Math.random() * 60;
        const angle = Math.random() * Math.PI * 2;
        // Velocidad angular más alta para que el giro se note
        const angularSpeed = (Math.random() - 0.5) * 0.02; // Puede ser positivo o negativo, lento pero visible
        stars.push({
          x: centerX + Math.cos(angle) * orbitRadius,
          y: centerY + Math.sin(angle) * orbitRadius,
          size: 0.5 + Math.random() * 2.5,
          brightness: 0.3 + Math.random() * 0.7,
          speed: 0.1 + Math.random() * 0.3,
          connections: [],
          angle,
          orbitRadius,
          angularSpeed,
          centerX,
          centerY,
        });
      }

      // Crear conexiones entre estrellas cercanas
      stars.forEach((star, i) => {
        star.connections = [];
        stars.forEach((otherStar, j) => {
          if (i !== j) {
            const dx = star.x - otherStar.x;
            const dy = star.y - otherStar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
              star.connections.push(j);
            }
          }
        });
      });

      starsRef.current = stars;
    };

    // Dibujar nebulosa de fondo
    const drawNebula = () => {
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.3,
        0,
        canvas.width * 0.3,
        canvas.height * 0.3,
        canvas.width * 0.8
      );
      gradient1.addColorStop(0, config.nebulaColor1);
      gradient1.addColorStop(1, "transparent");

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.7,
        0,
        canvas.width * 0.7,
        canvas.height * 0.7,
        canvas.width * 0.8
      );
      gradient2.addColorStop(0, config.nebulaColor2);
      gradient2.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.3;
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    // Dibujar conexiones entre estrellas
    const drawConnections = (stars: Star[]) => {
      ctx.strokeStyle = config.starColor;

      stars.forEach((star, i) => {
        star.connections.forEach((connectionIndex) => {
          if (connectionIndex > i) {
            // Evitar dibujar dos veces la misma conexión
            const otherStar = stars[connectionIndex];

            // Calcular opacidad basada en distancia
            const dx = star.x - otherStar.x;
            const dy = star.y - otherStar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const alpha = 1 - distance / config.connectionDistance;

            if (alpha > 0) {
              ctx.globalAlpha = alpha * config.lineOpacity;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(otherStar.x, otherStar.y);
              ctx.stroke();
            }
          }
        });
      });

      ctx.globalAlpha = 1;
    };

    // Dibujar estrellas
    const drawStars = (stars: Star[]) => {
      stars.forEach((star) => {
        // Brillo parpadeante suave
        const twinkle = 1 + Math.sin(Date.now() * 0.001 * star.speed) * 0.2;

        ctx.fillStyle = config.starColor;
        ctx.globalAlpha = star.brightness * twinkle;

        // Dibujar estrella con efecto de destello
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Destello adicional para estrellas más brillantes
        if (star.brightness > 0.5) {
          ctx.globalAlpha = star.brightness * 0.3 * twinkle;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
    };

    // Mover estrellas
    const moveStars = (stars: Star[]) => {
      stars.forEach((star) => {
        // Movimiento de giro sutil alrededor de su posición inicial
        star.angle += star.angularSpeed;
        star.x = star.centerX + Math.cos(star.angle) * star.orbitRadius;
        star.y = star.centerY + Math.sin(star.angle) * star.orbitRadius;
        // Movimiento aleatorio muy leve para naturalidad
        star.x += (Math.random() - 0.5) * 0.1;
        star.y += (Math.random() - 0.5) * 0.1;
      });
    };

    // Función de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawNebula();
      moveStars(starsRef.current);
      drawConnections(starsRef.current);
      drawStars(starsRef.current);

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Inicializar
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    // Limpieza
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default ConstellationBackground;
