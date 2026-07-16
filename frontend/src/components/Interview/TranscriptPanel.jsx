function TranscriptPanel({

    transcript

}) {

    return (

        <div className="bg-slate-100 rounded-xl mt-8 p-5">

            <h3 className="font-bold text-xl">

                Your Answer

            </h3>

            <p className="mt-4 min-h-[140px] whitespace-pre-wrap text-gray-700 leading-7">

                {

                    transcript ||

                    "🎤 Click the microphone and start speaking..."

                }

            </p>

        </div>

    );

}

export default TranscriptPanel;