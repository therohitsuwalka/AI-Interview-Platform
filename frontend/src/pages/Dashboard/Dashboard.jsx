import { useEffect, useState } from "react";

import StatsCard from "../../components/Dashboard/StatsCard";
import AnalyticsChart from "../../components/Dashboard/AnalyticsChart";
import QuickActionCard from "../../components/Dashboard/QuickActionCard";
import RecentInterviewCard from "../../components/Dashboard/RecentInterviewCard";
import ATSTrendChart from "../../components/Dashboard/ATSTrendChart";
import TopicsInsight from "../../components/Dashboard/TopicsInsight";

import { getDashboard } from "../../services/dashboardService";
import { getAnalyticsOverview } from "../../services/analyticsService";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    communicationAverage: 0,
    technicalAverage: 0,
    confidenceAverage: 0,
  });

  const [chartData, setChartData] = useState([]);

  const [recentInterviews, setRecentInterviews] = useState([]);

  const [analytics, setAnalytics] = useState({
    weakTopics: [],
    strongTopics: [],
    atsTrend: [],
    codingStats: { total: 0, accepted: 0 },
  });

  useEffect(() => {
    loadDashboard();
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalyticsOverview();
      setAnalytics(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();

      console.log("Dashboard API:", res.data);

      setStats(res.data.stats || {});
      setChartData(res.data.chartData || []);
      setRecentInterviews(res.data.recentInterviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white">
            Welcome {user.name || "User"} 👋
          </h1>

          <p className="mt-3 text-gray-400">
            AI Interview Platform Dashboard
          </p>
        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Interviews"
            value={stats.totalInterviews}
            subtitle="Completed"
            color="from-blue-500 to-cyan-500"
          />

          <StatsCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            subtitle="AI Evaluation"
            color="from-green-500 to-emerald-500"
          />

          <StatsCard
            title="Best Score"
            value={`${stats.bestScore}%`}
            subtitle="Highest Score"
            color="from-purple-500 to-pink-500"
          />

          <StatsCard
            title="Communication"
            value={`${stats.communicationAverage}%`}
            subtitle="Average"
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Performance Graph */}

        <div className="mt-10">
          <AnalyticsChart data={chartData} />
        </div>

        {/* Recent Interviews */}

        <div className="mt-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">

          <h2 className="text-3xl font-bold text-white mb-6">
            Recent Interviews
          </h2>

          {recentInterviews.length === 0 ? (
            <p className="text-gray-400">
              No interview history found.
            </p>
          ) : (
            <div className="grid gap-5">
              {recentInterviews.map((item, index) => (
                <RecentInterviewCard
                  key={index}
                  interview={item}
                />
              ))}
            </div>
          )}

        </div>

        {/* Resume ATS Trend */}

        <div className="mt-10">
          <ATSTrendChart data={analytics.atsTrend || []} />
        </div>

        {/* Weak / Strong Topics */}

        <div className="mt-10">
          <TopicsInsight
            weakTopics={analytics.weakTopics}
            strongTopics={analytics.strongTopics}
          />
        </div>

        {/* Coding Stats */}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Coding Submissions"
            value={analytics.codingStats?.total || 0}
            subtitle="Total Attempts"
            color="from-indigo-500 to-blue-500"
          />
          <StatsCard
            title="Accepted"
            value={analytics.codingStats?.accepted || 0}
            subtitle="Problems Solved"
            color="from-emerald-500 to-green-500"
          />
          <StatsCard
            title="Success Rate"
            value={
              analytics.codingStats?.total
                ? `${Math.round(
                    (analytics.codingStats.accepted / analytics.codingStats.total) * 100
                  )}%`
                : "0%"
            }
            subtitle="Accepted / Total"
            color="from-amber-500 to-orange-500"
          />
        </div>

        {/* Quick Actions */}

        <div className="mt-10">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Quick Actions
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <QuickActionCard
              title="Resume ATS"
              description="Analyze Resume"
              to="/resume-upload"
              icon="📄"
            />

            <QuickActionCard
              title="AI Interview"
              description="Start Interview"
              to="/interview"
              icon="🎤"
            />

            <QuickActionCard
              title="Coding Round"
              description="Practice Coding"
              to="/coding"
              icon="💻"
            />

            <QuickActionCard
              title="Interview History"
              description="View Results"
              to="/history"
              icon="📈"
            />

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;