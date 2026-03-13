# Waves SVG Components

Componentes para manejar el SVG de ondas con efectos de blur personalizables.

## Componentes Disponibles

### 1. WavesSvg
Componente principal que renderiza el SVG de ondas con efectos de blur.

```tsx
import { WavesSvg } from '@/shared/ui';

<WavesSvg
  variant="subtle"
  blurIntensity={2}
  animated={true}
  width={300}
  height={150}
/>
```

### 2. WavesBackground
Componente wrapper que posiciona las ondas como background.

```tsx
import { WavesBackground } from '@/shared/ui';

<WavesBackground
  variant="medium"
  fullSize={true}
  position="absolute"
  zIndex={-1}
/>
```

### 3. WavesExample
Componente de demostración con controles interactivos.

```tsx
import { WavesExample } from '@/shared/ui';

<WavesExample />
```

## Props

### WavesSvgProps
- `blurIntensity?: number` - Intensidad del blur (0-10)
- `blurLayers?: WaveLayer[]` - Capas específicas que tendrán blur
- `opacity?: number` - Opacidad general del componente
- `className?: string` - Clases CSS adicionales
- `width?: number | string` - Ancho del SVG
- `height?: number | string` - Alto del SVG
- `variant?: WaveVariant` - Variante predefinida
- `animated?: boolean` - Si debe animar el blur
- `animationSpeed?: number` - Velocidad de animación

### WaveVariant
- `'subtle'` - Blur sutil en capas cls-2 y cls-6
- `'medium'` - Blur medio en capas cls-2, cls-5 y cls-6
- `'strong'` - Blur fuerte en múltiples capas
- `'custom'` - Configuración personalizada

### WaveLayer
- `'cls-1'` - Primera capa de gradiente
- `'cls-2'` - Segunda capa de gradiente
- `'cls-3'` - Tercera capa de gradiente
- `'cls-4'` - Capa azul sólida
- `'cls-5'` - Quinta capa de gradiente
- `'cls-6'` - Sexta capa de gradiente

## Hooks

### useWavesBlur
Hook para manejar la configuración y animación del blur.

```tsx
import { useWavesBlur } from '@/shared/ui';

const { blurConfig, animationState, animateBlur, toggleBlur } = useWavesBlur('subtle');
```

### useWavesAnimation
Hook para manejar animaciones cíclicas.

```tsx
import { useWavesAnimation } from '@/shared/ui';

const { isAnimating } = useWavesAnimation(true, 2);
```

## Ejemplos de Uso

### Background con blur sutil
```tsx
<div className="relative min-h-screen">
  <WavesBackground variant="subtle" fullSize />
  <div className="relative z-10">
    {/* Tu contenido aquí */}
  </div>
</div>
```

### SVG con blur personalizado
```tsx
<WavesSvg
  variant="custom"
  blurIntensity={3}
  blurLayers={['cls-2', 'cls-5']}
  animated={true}
  animationSpeed={2}
  width="100%"
  height={200}
/>
```

### Animación de blur
```tsx
const { animateBlur, toggleBlur } = useWavesBlur('medium');

return (
  <div>
    <WavesSvg variant="custom" animated />
    <button onClick={() => animateBlur(5, 1000)}>
      Aplicar Blur Fuerte
    </button>
    <button onClick={toggleBlur}>
      Alternar Blur
    </button>
  </div>
);
```

## Variantes Predefinidas

| Variante | Intensidad | Capas | Opacidad | Velocidad |
|----------|------------|-------|----------|-----------|
| subtle   | 1.5        | cls-2, cls-6 | 0.8 | 2s |
| medium   | 3          | cls-2, cls-5, cls-6 | 0.9 | 1.5s |
| strong   | 5          | cls-1, cls-2, cls-5, cls-6 | 1 | 1s |
| custom   | 0          | [] | 1 | 1s |

## Notas Técnicas

- Los filtros SVG se generan dinámicamente basados en la configuración
- Las animaciones usan `requestAnimationFrame` para suavidad
- El componente es completamente responsive
- Compatible con SSR (Server-Side Rendering)
