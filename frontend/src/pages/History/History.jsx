import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getInterviewHistory } from "../../services/interviewService";
import { downloadInterviewReportPDF } from "../../services/reportService";

function History() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getInterviewHistory();

      setHistory(res.data.interviews || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load interview history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <h1 className="text-3xl font-bold">
          Loading Interview History...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-500">
        <h1 className="text-2xl">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-white mb-8">
          Interview History
        </h1>

        {history.length === 0 ? (

          <div className="bg-slate-900 rounded-3xl p-10 text-center">

            <h2 className="text-3xl text-white">

              No Interviews Found

            </h2>

            <p className="text-gray-400 mt-4">

              Complete your first interview to see history.

            </p>

          </div>

        ) : (

          <div className="overflow-x-auto rounded-3xl shadow-xl">

            <table className="min-w-full bg-slate-900 text-white">

              <thead className="bg-slate-800">

                <tr>

                  <th className="p-5 text-left">Company</th>

                  <th className="p-5 text-left">Role</th>

                  <th className="p-5 text-center">Score</th>

                  <th className="p-5 text-center">Status</th>

                  <th className="p-5 text-center">Date</th>

                  <th className="p-5 text-center">Action</th>

                </tr>

              </thead>

              <tbody>

                {history.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-slate-800 hover:bg-slate-800"
                  >

                    <td className="p-5">
                      {item.company}
                    </td>

                    <td className="p-5">
                      {item.role}
                    </td>

                    <td className="p-5 text-center font-bold text-green-400">
                      {item.overallScore}%
                    </td>

                    <td className="p-5 text-center">
                      {item.status}
                    </td>

                    <td className="p-5 text-center">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-5 text-center flex items-center justify-center gap-2">

                      <Link
                        to={`/history/${item._id}`}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                      >
                        View
                      </Link>

                      <button
                        onClick={async () => {
                          try {
                            await downloadInterviewReportPDF(item._id);
                          } catch (err) {
                            console.error(err);
                            toast.error("Failed to download PDF report.");
                          }
                        }}
                        className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
                      >
                        📄 PDF
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default History;