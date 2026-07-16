import Interview from "../models/Interview.js";

export const getAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });

    const totalInterviews = interviews.length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            interviews.reduce(
              (sum, item) => sum + item.overallScore,
              0
            ) / totalInterviews
          )
        : 0;

    const highestScore =
      totalInterviews > 0
        ? Math.max(...interviews.map((i) => i.overallScore))
        : 0;

    const lowestScore =
      totalInterviews > 0
        ? Math.min(...interviews.map((i) => i.overallScore))
        : 0;

    const latestInterviews = interviews.slice(0, 5);

    return res.status(200).json({
      success: true,
      analytics: {
        totalInterviews,
        averageScore,
        highestScore,
        lowestScore,
        latestInterviews,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
    });
  }
};