import { Link } from "react-router-dom";

function QuickActionCard({

  title,

  description,

  to,

  icon,

}) {

  return (

    <Link

      to={to}

      className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 hover:scale-105 transition-all duration-300"

    >

      <div className="text-5xl">

        {icon}

      </div>

      <h2 className="mt-5 text-2xl font-bold text-white">

        {title}

      </h2>

      <p className="mt-3 text-gray-400">

        {description}

      </p>

    </Link>

  );

}

export default QuickActionCard;