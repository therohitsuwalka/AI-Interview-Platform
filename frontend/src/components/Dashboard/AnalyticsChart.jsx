import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function AnalyticsChart({ data }) {
  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        Interview Performance
      </h2>

      <div className="h-[320px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              stroke="#CBD5E1"
            />

            <YAxis
              stroke="#CBD5E1"
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AnalyticsChart;