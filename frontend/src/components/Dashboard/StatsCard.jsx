import { ArrowUpRight } from "lucide-react";

function StatsCard({
  title,
  value,
  subtitle,
  color = "from-blue-500 to-cyan-500",
}) {
  return (
    <div
      className={`
      rounded-3xl
      bg-white/10
      backdrop-blur-xl
      border
      border-white/20
      p-6
      shadow-xl
      hover:scale-105
      transition-all
      duration-300
    `}
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-400 text-sm">

            {title}

          </p>

          <h2 className="text-4xl font-bold text-white mt-2">

            {value}

          </h2>

          <p className="text-gray-400 mt-3">

            {subtitle}

          </p>

        </div>

        <div
          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <ArrowUpRight
            className="text-white"
            size={26}
          />
        </div>

      </div>
    </div>
  );
}

export default StatsCard;