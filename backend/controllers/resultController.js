import Interview from "../models/Interview.js";

export const saveResult = async (req, res) => {
  try {

    const {
      company,
      role,
      score,
      communication,
      technical,
      confidence,
      feedback,
    } = req.body;

    const interview = await Interview.create({
      company,
      role,
      score,
      communication,
      technical,
      confidence,
      feedback,
    });

    res.status(201).json({
      success: true,
      interview,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getHistory = async (req, res) => {

  try {

    const interviews = await Interview
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      interviews,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};