import React from 'react';

interface SimpleWavesSvgProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  /** Colores personalizados para las capas */
  colors?: {
    cls1?: string;  // Primera capa de gradiente
    cls2?: string;  // Segunda capa de gradiente  
    cls3?: string;  // Tercera capa de gradiente
    cls4?: string;  // Capa azul sólida
    cls5?: string;  // Quinta capa de gradiente
    cls6?: string;  // Sexta capa de gradiente
  };
}

const WavesSvg: React.FC<SimpleWavesSvgProps> = ({
  className = '',
  style,
  width = 1217.4,
  height = 615.64,
  colors
}) => {
  const svgStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'block',
    ...style
  };

  // Colores por defecto
  const defaultColors = {
    cls1: '#003c9a',
    cls2: '#003c9a', 
    cls3: '#0043a7',
    cls4: '#00bfff',
    cls5: '#003c9a',
    cls6: '#0043a7'
  };

  // Combinar colores por defecto con los personalizados
  const finalColors = { ...defaultColors, ...colors };

  return (
    <svg
      id="Layer_2"
      data-name="Layer 2"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1217.4 615.64"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={svgStyle}
    >
      <defs>
        <style>
          {`
            .cls-1 { fill: url(#radial-gradient-2); }
            .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6 { stroke-width: 0px; }
            .cls-2 { fill: url(#radial-gradient-5); }
            .cls-3 { fill: url(#radial-gradient); }
            .cls-4 { fill: ${finalColors.cls4}; }
            .cls-5 { fill: url(#radial-gradient-3); }
            .cls-6 { fill: url(#radial-gradient-4); }
          `}
        </style>
        
        <radialGradient id="radial-gradient" cx="4.71" cy="237.75" fx="4.71" fy="237.75" r="7.57" gradientUnits="userSpaceOnUse">
          <stop offset=".93" stopColor={finalColors.cls3}/>
          <stop offset=".96" stopColor={finalColors.cls3}/>
        </radialGradient>
        
        <radialGradient id="radial-gradient-2" cx="4.52" cy="240.09" fx="4.52" fy="240.09" r="10.12" gradientUnits="userSpaceOnUse">
          <stop offset=".91" stopColor={finalColors.cls1}/>
          <stop offset=".95" stopColor={finalColors.cls1}/>
          <stop offset=".99" stopColor={finalColors.cls1}/>
        </radialGradient>
        
        <radialGradient id="radial-gradient-3" cx="608.7" cy="307.82" fx="608.7" fy="307.82" r="482.32" gradientUnits="userSpaceOnUse">
          <stop offset=".91" stopColor={finalColors.cls5}/>
          <stop offset=".95" stopColor={finalColors.cls5}/>
          <stop offset=".99" stopColor={finalColors.cls5}/>
        </radialGradient>
        
        <radialGradient id="radial-gradient-4" cx="1334.31" cy="1589.76" fx="1334.31" fy="1589.76" r="1651" xlinkHref="#radial-gradient"/>
        <radialGradient id="radial-gradient-5" cx="1051.94" cy="1475.96" fx="1051.94" fy="1475.96" r="1547.93" xlinkHref="#radial-gradient-2"/>
      </defs>
      
      <g id="Layer_1-2" data-name="Layer 1">
        <path className="cls-3" d="M3.89,230.4c-1.3.75-2.6,1.5-3.89,2.25h0c1.29-.76,2.59-1.5,3.89-2.25Z"/>
        <path className="cls-1" d="M3.89,230.4c-1.3.75-2.6,1.5-3.89,2.25h0c1.29-.76,2.59-1.5,3.89-2.25Z"/>
        <path className="cls-5" d="M1102.82,0h114.58c-237.04,50.05-402.82,119.68-634.39,255.92C437.26,341.67,147.65,563.79,0,615.64v-272.99c1.29-.75,2.59-1.5,3.89-2.25-1.3.75-2.6,1.49-3.89,2.24L.54,0h1102.31-.03Z"/>
        <path className="cls-1" d="M3.89,230.4c-1.3.75-2.6,1.5-3.89,2.25h0c1.29-.76,2.59-1.5,3.89-2.25Z"/>
        <path className="cls-4" d="M1217.4,0c-237.04,50.05-402.82,119.68-634.39,255.92C437.26,341.67,147.65,563.79,0,615.64v-129.25c141.81-93.27,341.48-205.43,559.38-303.42,79.55-35.77,161.56-67.84,242.4-95.8C907.09,51.24,1009.82,21.72,1102.82,0h114.58Z"/>
        <path className="cls-6" d="M1102.31,0c-92.93,21.57-195.75,50.92-300.53,87.17-80.84,27.96-162.85,60.03-242.4,95.8C341.48,280.96,141.81,393.12,0,486.39v-143.75c1.29-.75,2.59-1.49,3.89-2.24,2.09-1.2,4.19-2.4,6.3-3.59,133.1-75.3,314.38-143.79,470.96-201.25C640.13,77.22,779.11,33.05,904.77,0h197.54Z"/>
        <path className="cls-2" d="M904.77,0c-125.66,33.05-264.64,77.22-423.62,135.56-156.58,57.46-337.86,125.95-470.96,201.25-2.11,1.19-4.21,2.39-6.3,3.59-1.3.75-2.6,1.5-3.89,2.25V0h904.77Z"/>
      </g>
    </svg>
  );
};

export default WavesSvg;
