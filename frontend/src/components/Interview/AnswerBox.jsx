function AnswerBox({ transcript }) {

  const words = transcript
    ? transcript
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  const characters = transcript ? transcript.length : 0;

  return (

    <div className="bg-slate-100 rounded-2xl mt-8 p-6 border">

      <div className="flex justify-between items-center">

        <h3 className="font-bold text-xl">

          Your Answer

        </h3>

        <div className="flex gap-3">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">

            Words : {words}

          </span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">

            Characters : {characters}

          </span>

        </div>

      </div>

      <div className="mt-5 min-h-[180px] rounded-xl bg-white border p-5 overflow-y-auto">

        <p className="leading-8 whitespace-pre-wrap text-gray-700">

          {transcript ||

            "🎤 Click the microphone and start speaking..."}

        </p>

      </div>

      <div className="mt-5 flex justify-between items-center">

        <p className="text-sm text-gray-500">

          Answer is updating live...

        </p>

        <div className="flex items-center gap-2">

          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

          <span className="text-sm font-medium text-green-700">

            Recording Ready

          </span>

        </div>

      </div>

    </div>

  );

}

export default AnswerBox;