import Interview from "../models/Interview.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    }).sort({ createdAt: 1 });

    const totalInterviews = interviews.length;

    const totalScore = interviews.reduce(
      (sum, item) => sum + Number(item.overallScore || 0),
      0
    );

    const averageScore = totalInterviews
      ? Math.round(totalScore / totalInterviews)
      : 0;

    const bestScore = totalInterviews
      ? Math.max(...interviews.map((i) => i.overallScore || 0))
      : 0;

    const communicationAverage = totalInterviews
      ? Math.round(
          interviews.reduce(
            (sum, item) => sum + Number(item.communication || 0),
            0
          ) / totalInterviews
        )
      : 0;

    const technicalAverage = totalInterviews
      ? Math.round(
          interviews.reduce(
            (sum, item) => sum + Number(item.technical || 0),
            0
          ) / totalInterviews
        )
      : 0;

    const confidenceAverage = totalInterviews
      ? Math.round(
          interviews.reduce(
            (sum, item) => sum + Number(item.confidence || 0),
            0
          ) / totalInterviews
        )
      : 0;

    // Performance Chart
    const chartData = interviews.map((item, index) => ({
      name: `#${index + 1}`,
      score: item.overallScore,
    }));

    // Recent Interviews
    const recentInterviews = interviews
      .slice(-5)
      .reverse()
      .map((item) => ({
        company: item.company,
        role: item.role,
        score: item.overallScore,
        date: item.createdAt,
      }));

    return res.json({
      success: true,

      stats: {
        totalInterviews,
        averageScore,
        bestScore,
        communicationAverage,
        technicalAverage,
        confidenceAverage,
      },

      chartData,

      recentInterviews,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};