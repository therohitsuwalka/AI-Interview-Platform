import { Mic, MicOff } from "lucide-react";

function InterviewControls({

    isListening,

    handleMic

}) {

    return (

        <div className="flex justify-center mt-8">

            <button

                onClick={handleMic}

                className={`p-5 rounded-full text-white transition-all duration-300 ${

                    isListening

                        ? "bg-green-600 hover:bg-green-700"

                        : "bg-red-500 hover:bg-red-600"

                }`}

            >

                {

                    isListening

                        ? <Mic />

                        : <MicOff />

                }

            </button>

        </div>

    );

}

export default InterviewControls;