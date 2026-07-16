import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex">

        {/* Sidebar */}

        <div className="w-72 bg-slate-900 text-white min-h-screen p-8">

          <h1 className="text-3xl font-bold">

            InterviewX AI

          </h1>

          <div className="mt-10 space-y-5">

            <p className="cursor-pointer hover:text-blue-400">

              Dashboard

            </p>

            <p className="cursor-pointer hover:text-blue-400">

              AI Interview

            </p>

            <p className="cursor-pointer hover:text-blue-400">

              Resume Analyzer

            </p>

            <p className="cursor-pointer hover:text-blue-400">

              History

            </p>

            <p className="cursor-pointer hover:text-blue-400">

              Profile

            </p>

          </div>

        </div>

        {/* Content */}

        <div className="flex-1 p-10">

          <Outlet/>

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;