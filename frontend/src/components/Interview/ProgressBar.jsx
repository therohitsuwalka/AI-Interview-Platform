function ProgressBar({

    currentQuestion,

    totalQuestions

}) {

    return (

        <>

            <p className="text-blue-600 font-bold">

                Question {currentQuestion + 1} / {totalQuestions}

            </p>

            <div className="w-full h-3 rounded-full bg-slate-200 mt-4">

                <div

                    className="h-3 rounded-full bg-blue-600 transition-all duration-300"

                    style={{

                        width: `${((currentQuestion + 1) / totalQuestions) * 100}%`

                    }}

                />

            </div>

        </>

    );

}

export default ProgressBar;