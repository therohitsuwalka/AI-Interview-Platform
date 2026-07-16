import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

import Dashboard from "../pages/Dashboard/Dashboard";
import Interview from "../pages/Interview/Interview";
import CreateInterview from "../pages/CreateInterview/CreateInterview";
import Result from "../pages/Result/Result";
import ResumeAnalyzer from "../pages/Resume/ResumeAnalyzer";
import ResumeUpload from "../pages/Resume/ResumeUpload";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route element={<PublicLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

        </Route>

        {/* Dashboard */}

        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/create-interview"
            element={<CreateInterview />}
          />

          <Route
            path="/interview"
            element={<Interview />}
          />

          <Route
            path="/result"
            element={<Result />}
          />

          <Route
            path="/resume"
            element={<ResumeAnalyzer />}
          />

          <Route
            path="/resume-upload"
            element={<ResumeUpload />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;