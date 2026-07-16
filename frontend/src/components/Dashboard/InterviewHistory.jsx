import { useEffect, useState } from "react";
import { getHistory } from "../../services/resultService";

function InterviewHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory = async () => {

    try {

      const res = await getHistory();

      setHistory(res.data.interviews);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

      <h2 className="text-3xl font-bold">

        Recent Interviews

      </h2>

      {
        history.length === 0 ? (

          <p className="text-gray-500 mt-6">

            No Interviews Yet

          </p>

        ) : (

          <div className="mt-6 space-y-5">

            {
              history.map((item) => (

                <div
                  key={item._id}
                  className="border rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition"
                >

                  <div>

                    <h3 className="font-bold text-xl">

                      {item.company}

                    </h3>

                    <p className="text-gray-500">

                      {item.role}

                    </p>

                  </div>

                  <div className="text-blue-600 font-bold text-2xl">

                    {item.score}%

                  </div>

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  );

}

export default InterviewHistory;