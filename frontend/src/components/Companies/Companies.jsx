function Companies() {

  const companies = [

    "Google",
    "Microsoft",
    "Amazon",
    "Adobe",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture",
    "Other"

  ];

  return (

    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">

          Trusted By Top Companies

        </h2>

        <p className="text-center text-gray-500 mt-5 text-lg">

          Prepare for interviews of leading tech companies.

        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">

          {companies.map((company,index)=>(

            <div
            key={index}
            className="h-28 rounded-2xl border flex items-center justify-center
            text-2xl font-bold hover:bg-blue-600 hover:text-white
            duration-300 shadow-md">

              {company}

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}

export default Companies;