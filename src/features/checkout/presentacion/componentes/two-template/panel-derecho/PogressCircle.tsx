interface ProgressCircleProps {
    progress: number
    text: string
  }
  
  export default function ProgressCircle({ progress, text }: ProgressCircleProps) {
    const radius = 20
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference
  
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r={radius} fill="transparent" stroke="#e6e6e6" strokeWidth="4" />
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="transparent"
            stroke="#4ade80"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 25 25)"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <span className="absolute text-xs font-medium">{text}</span>
      </div>
    )
  }
  