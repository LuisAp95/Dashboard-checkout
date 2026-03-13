import React from 'react';
import WavesSvg from './WavesSvg';

interface SimpleWavesBackgroundProps {
  className?: string;
  fullSize?: boolean;
  position?: 'fixed' | 'absolute' | 'relative';
  zIndex?: number;
  /** Colores personalizados para las capas del SVG */
  colors?: {
    cls1?: string;
    cls2?: string;
    cls3?: string;
    cls4?: string;
    cls5?: string;
    cls6?: string;
  };
}

const WavesBackground: React.FC<SimpleWavesBackgroundProps> = ({
  fullSize = true,
  position = 'absolute',
  zIndex = -1,
  className = '',
  colors
}) => {
  const containerStyle: React.CSSProperties = {
    position,
    top: 0,
    left: 0,
    width: fullSize ? '100%' : 'auto',
    height: fullSize ? '100%' : 'auto',
    zIndex,
    pointerEvents: 'none',
    overflow: 'hidden'
  };

  const svgStyle = fullSize ? {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover' as const
  } : {};

  return (
    <div style={containerStyle} className={className}>
      <WavesSvg style={svgStyle} colors={colors} />
    </div>
  );
};

export default WavesBackground;
