import { useEffect, useState } from "react";

function ScoreCircle({ score = 0 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      current++;

      if (current >= score) {
        current = score;
        clearInterval(timer);
      }

      setProgress(current);
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 75;
  const stroke = 12;

  const normalizedRadius = radius - stroke * 0.5;

  const circumference =
    normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference -
    (progress / 100) * circumference;

  let color = "#22c55e";

  if (score < 70) color = "#f59e0b";

  if (score < 50) color = "#ef4444";

  return (
    <div className="flex flex-col items-center">

      <div className="relative">

        <svg
          width={170}
          height={170}
          className="-rotate-90"
        >

          <circle
            stroke="#334155"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="85"
            cy="85"
          />

          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition:
                "stroke-dashoffset 0.4s ease",
            }}
            r={normalizedRadius}
            cx="85"
            cy="85"
          />

        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <h1 className="text-4xl font-bold text-white">

            {progress}%

          </h1>

          <p className="text-gray-400">

            ATS Score

          </p>

        </div>

      </div>

      <p className="mt-6 text-gray-300 text-center max-w-xs">

        Your resume has been analyzed using our
        AI ATS engine.

      </p>

    </div>
  );
}

export default ScoreCircle;