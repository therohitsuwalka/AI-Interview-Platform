import { Clock3 } from "lucide-react";

function InterviewHeader({ minutes, seconds }) {
  return (
    <div className="bg-white shadow p-5 flex justify-between items-center">

      <div>

        <h1 className="text-3xl font-bold">

          AI Interview

        </h1>

        <p className="text-gray-500 mt-1">

          Professional Mock Interview

        </p>

      </div>

      <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-xl">

        <Clock3 className="text-blue-600" />

        <span className="text-2xl font-bold">

          {minutes}:{seconds.toString().padStart(2, "0")}

        </span>

      </div>

    </div>
  );
}

export default InterviewHeader;