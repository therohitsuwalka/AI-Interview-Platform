function SectionCard({
  title,
  items = [],
  color = "blue",
}) {
  const colors = {
    blue: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      badge: "bg-blue-500/20 text-blue-300",
    },

    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      badge: "bg-green-500/20 text-green-300",
    },

    red: {
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      badge: "bg-red-500/20 text-red-300",
    },

    yellow: {
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
      badge: "bg-yellow-500/20 text-yellow-300",
    },

    purple: {
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      badge: "bg-purple-500/20 text-purple-300",
    },
  };

  const theme = colors[color] || colors.blue;

  return (
    <div
      className={`
        rounded-3xl
        border
        ${theme.border}
        ${theme.bg}
        backdrop-blur-xl
        p-6
        shadow-xl
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-2xl
      `}
    >
      <h2 className="mb-6 text-2xl font-bold text-white">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-400">
          No Data Available
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <span
              key={index}
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                ${theme.badge}
              `}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SectionCard;