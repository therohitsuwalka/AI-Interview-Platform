function ProgressBar({

    title,

    value = 0,

    color = "bg-blue-500"

}) {

    return (

        <div>

            <div className="flex justify-between mb-2">

                <p className="text-white">

                    {title}

                </p>

                <p className="text-gray-300">

                    {value}%

                </p>

            </div>

            <div className="h-3 rounded-full bg-slate-700 overflow-hidden">

                <div

                    className={`h-full rounded-full transition-all duration-1000 ${color}`}

                    style={{

                        width: `${value}%`

                    }}

                />

            </div>

        </div>

    );

}

export default ProgressBar;