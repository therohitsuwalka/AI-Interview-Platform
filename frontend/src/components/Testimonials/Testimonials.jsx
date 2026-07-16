import { Star } from "lucide-react";

function Testimonials() {

    const reviews = [

        {
            name: "Rohit Sharma",
            role: "Software Engineer",
            company: "Google",
            review: "This AI interview platform helped me improve my confidence before placements."
        },

        {
            name: "Priya Verma",
            role: "Frontend Developer",
            company: "Microsoft",
            review: "The resume analysis and mock interview experience were amazing."
        },

        {
            name: "Amit Kumar",
            role: "SDE Intern",
            company: "Amazon",
            review: "Very realistic interview questions with instant AI feedback."
        }

    ];

    return (

        <section className="py-24 bg-slate-100">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-5xl font-bold text-center">

                    What Students Say

                </h2>

                <p className="text-center text-gray-500 mt-5">

                    Thousands of students trust InterviewX AI.

                </p>

                <div className="grid lg:grid-cols-3 gap-8 mt-16">

                    {reviews.map((item,index)=>(

                        <div
                        key={index}
                        className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl duration-300">

                            <div className="flex">

                                <Star fill="#FFD700"/>
                                <Star fill="#FFD700"/>
                                <Star fill="#FFD700"/>
                                <Star fill="#FFD700"/>
                                <Star fill="#FFD700"/>

                            </div>

                            <p className="mt-6 text-gray-600 leading-8">

                                "{item.review}"

                            </p>

                            <div className="mt-8">

                                <h3 className="font-bold text-xl">

                                    {item.name}

                                </h3>

                                <p className="text-gray-500">

                                    {item.role}

                                </p>

                                <p className="text-blue-600 font-semibold">

                                    {item.company}

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    )

}

export default Testimonials;