import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateInterview } from "../../services/interviewService";

function CreateInterview() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    experience: "",
    difficulty: "Medium",
    questions: 10,
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const res = await generateInterview(formData);

    localStorage.setItem(
      "questions",
      JSON.stringify(res.data.questions)
    );

    localStorage.setItem(
      "interviewData",
      JSON.stringify(formData)
    );

    navigate("/interview");

  } catch (error) {

    console.log(error);

    alert("Unable to generate interview.");

  }

};

  return (

    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-8">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-10">

        <h1 className="text-4xl font-bold mb-2">

          Create AI Interview

        </h1>

        <p className="text-gray-500 mb-8">

          Fill the details below to generate your interview.

        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="text"
            name="company"
            placeholder="Company (Google, Amazon...)"
            className="w-full border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Job Role (Frontend Developer)"
            className="w-full border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience (Fresher / 1 Year)"
            className="w-full border rounded-xl p-4"
            onChange={handleChange}
            required
          />

          <select
            name="difficulty"
            className="w-full border rounded-xl p-4"
            onChange={handleChange}
          >

            <option>Easy</option>

            <option selected>Medium</option>

            <option>Hard</option>

          </select>

          <input
            type="number"
            name="questions"
            className="w-full border rounded-xl p-4"
            value={formData.questions}
            min="5"
            max="20"
            onChange={handleChange}
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
          >

            Generate Interview 🚀

          </button>

        </form>

      </div>

    </div>

  );

}

export default CreateInterview;