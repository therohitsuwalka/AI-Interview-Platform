import Webcam from "react-webcam";
import { Camera } from "lucide-react";

function WebcamPanel({ webcamRef }) {

    return (

        <div className="rounded-2xl overflow-hidden">

            <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                className="w-full rounded-2xl"
            />

            <div className="mt-4 flex justify-center">

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition"
                >

                    <Camera />

                </button>

            </div>

        </div>

    );

}

export default WebcamPanel;