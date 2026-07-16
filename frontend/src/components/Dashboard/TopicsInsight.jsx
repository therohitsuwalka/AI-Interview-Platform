import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function TopicsInsight({ weakTopics = [], strongTopics = [] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <h2 className="text-xl font-bold text-white mb-1">⚠️ Weak Topics</h2>
        <p className="text-sm text-gray-400 mb-6">
          Skills to focus on based on your resume gaps &amp; low-scoring answers
        </p>

        {weakTopics.length === 0 ? (
          <p className="text-gray-400">No weak topics detected yet — keep it up!</p>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weakTopics} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#CBD5E1" allowDecimals={false} />
                <YAxis type="category" dataKey="topic" stroke="#CBD5E1" width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#f87171" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <h2 className="text-xl font-bold text-white mb-1">💪 Strong Topics</h2>
        <p className="text-sm text-gray-400 mb-6">
          Areas where you consistently score well in adaptive interviews
        </p>

        {strongTopics.length === 0 ? (
          <p className="text-gray-400">Complete a few adaptive interviews to see this.</p>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strongTopics} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#CBD5E1" allowDecimals={false} />
                <YAxis type="category" dataKey="topic" stroke="#CBD5E1" width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#4ade80" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicsInsight;
