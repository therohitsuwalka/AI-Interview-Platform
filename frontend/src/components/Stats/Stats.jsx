function Stats() {

    const stats = [

        {
            number: "10K+",
            title: "Students"
        },

        {
            number: "98%",
            title: "Success Rate"
        },

        {
            number: "200+",
            title: "Companies"
        },

        {
            number: "24/7",
            title: "AI Interview"
        }

    ];

    return (

        <section className="bg-white py-20">

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">

                {stats.map((item,index)=>(

                    <div
                    key={index}
                    className="text-center p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">

                        <h1 className="text-5xl font-bold text-blue-600">

                            {item.number}

                        </h1>

                        <p className="mt-4 text-gray-500">

                            {item.title}

                        </p>

                    </div>

                ))}

            </div>

        </section>

    )

}

export default Stats;