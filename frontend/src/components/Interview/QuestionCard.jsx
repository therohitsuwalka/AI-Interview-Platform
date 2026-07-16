import ProgressBar from "./ProgressBar";
import { ChevronRight } from "lucide-react";

function QuestionCard({

    question,

    currentQuestion,

    totalQuestions,

    nextQuestion

}) {

    return (

        <div className="bg-white rounded-3xl shadow-lg p-8">

            <ProgressBar

                currentQuestion={currentQuestion}

                totalQuestions={totalQuestions}

            />

            <h2 className="text-3xl font-bold mt-8 leading-relaxed">

                {question}

            </h2>

            <button

                onClick={nextQuestion}

                className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition"

            >

                Next

                <ChevronRight />

            </button>

        </div>

    );

}

export default QuestionCard;