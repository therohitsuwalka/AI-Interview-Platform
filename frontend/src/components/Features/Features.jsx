import {
  Brain,
  FileText,
  Code2,
  Mic,
  Camera,
  BarChart3,
  ArrowRight
} from "lucide-react";

function Features() {

  const features = [

    {
      icon: <Brain size={42} />,
      title: "AI Mock Interview",
      desc: "Practice HR & Technical interviews with AI and receive instant feedback."
    },

    {
      icon: <FileText size={42} />,
      title: "Resume Analyzer",
      desc: "Analyze your resume and improve ATS score for placements."
    },

    {
      icon: <Code2 size={42} />,
      title: "Coding Interview",
      desc: "Solve DSA questions with an online compiler and timer."
    },

    {
      icon: <Mic size={42} />,
      title: "Voice Analysis",
      desc: "Evaluate confidence, clarity and speaking speed."
    },

    {
      icon: <Camera size={42} />,
      title: "Face Detection",
      desc: "Track eye contact and facial expressions during interviews."
    },

    {
      icon: <BarChart3 size={42} />,
      title: "Performance Analytics",
      desc: "View detailed interview reports and progress charts."
    }

  ];

  return (

    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">

          Powerful Features

        </h2>

        <p className="text-center text-gray-500 mt-5 text-lg">

          Everything you need to prepare for your dream placement.

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {features.map((item,index)=>(

            <div
            key={index}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 duration-300">

              <div className="text-blue-600">

                {item.icon}

              </div>

              <h3 className="text-2xl font-bold mt-6">

                {item.title}

              </h3>

              <p className="text-gray-500 mt-4 leading-8">

                {item.desc}

              </p>

              <button className="flex items-center gap-2 mt-8 text-blue-600 font-semibold">

                Learn More

                <ArrowRight
                size={18}
                className="group-hover:translate-x-2 duration-300"
                />

              </button>

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}

export default Features;