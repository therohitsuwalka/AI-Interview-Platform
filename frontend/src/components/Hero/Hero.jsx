import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-8 items-center">

        {/* Left */}
        <div>

          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
            🚀 AI Powered Recruitment Platform
          </span>

          <h1 className="mt-8 text-6xl font-black leading-tight text-slate-900">
            Crack Your
            <span className="text-blue-600"> Dream Job</span>
            <br />
            With AI
          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-9">
            Practice HR interviews, technical interviews,
            coding interviews and receive instant AI feedback
            with voice analysis and resume evaluation.
          </p>

          <div className="flex gap-5 mt-10">

            <Link to="/signup">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg">
                Start Free
              </button>
            </Link>

            <Link to="/interview">
              <button className="border border-slate-300 px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 hover:scale-105">
                Watch Demo
              </button>
            </Link>

          </div>

        </div>

        {/* Right */}
        <div className="py-24 flex justify-center">

          <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-2xl flex justify-center items-center text-white text-8xl animate-pulse">

            🤖

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;