import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function ATSTrendChart({ data }) {
  const formatted = data.map((d, i) => ({
    name: `#${i + 1}`,
    "ATS Score": d.atsScore,
    ...(d.matchScore !== null && d.matchScore !== undefined
      ? { "JD Match Score": d.matchScore }
      : {}),
  }));

  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Resume ATS Trend</h2>

      {formatted.length === 0 ? (
        <p className="text-gray-400">No resume analyses yet.</p>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#CBD5E1" />
              <YAxis stroke="#CBD5E1" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ATS Score"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="JD Match Score"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ATSTrendChart;
