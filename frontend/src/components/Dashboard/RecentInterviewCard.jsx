function RecentInterviewCard({ interview }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5 hover:border-blue-500 transition">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-white text-lg font-semibold">
            {interview.company}
          </h3>

          <p className="text-gray-400 mt-1">
            {interview.role}
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            {interview.score}%
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {new Date(interview.date).toLocaleDateString()}
          </p>
        </div>

      </div>

    </div>
  );
}

export default RecentInterviewCard;