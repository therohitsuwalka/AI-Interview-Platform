import Home from "./pages/Home/Home";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import ResumeUpload from "./pages/Resume/ResumeUpload";
import ResumeAnalyzer from "./pages/Resume/ResumeAnalyzer";
import Interview from "./pages/Interview/Interview";
import AdaptiveInterview from "./pages/Interview/AdaptiveInterview";
import Result from "./pages/Result/Result";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp/VerifyOtp";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import RecruiterLogin from "./pages/RecruiterLogin/RecruiterLogin";
import RecruiterSignup from "./pages/RecruiterSignup/RecruiterSignup";

import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";

import MainLayout from "./components/Layout/MainLayout";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RecruiterProtectedRoute from "./components/Auth/RecruiterProtectedRoute";

// Recruiter Dashboard
import RecruiterDashboard from "./pages/RecruiterDashboard/RecruiterDashboard";

import RecruiterCandidate from "./pages/RecruiterCandidate/RecruiterCandidate";

import CreateJob from "./pages/CreateJob/CreateJob";

import MyJobs from "./pages/MyJobs/MyJobs";

import ViewJob from "./pages/ViewJob/ViewJob";

import CodingRound from "./pages/Coding/CodingRound";

import InterviewSetup from "./pages/InterviewSetup/InterviewSetup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================
              PUBLIC ROUTES
        ========================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Recruiter */}

        <Route path="/recruiter/login" element={<RecruiterLogin />} />

        <Route path="/recruiter/signup" element={<RecruiterSignup />} />

        {/* ==========================
              DEFAULT
        ========================== */}

        <Route path="/" element={<Home />} />
        {/* ==========================
              STUDENT PROTECTED ROUTES
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ResumeUpload />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-analysis"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ResumeAnalyzer />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Interview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/adaptive-interview"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdaptiveInterview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Result />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <History />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-setup"
          element={
            <ProtectedRoute>
              <MainLayout>
                <InterviewSetup />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==========================
              RECRUITER PROTECTED
        ========================== */}

        <Route
          path="/recruiter/dashboard"
          element={
            <RecruiterProtectedRoute>
              <RecruiterDashboard />
            </RecruiterProtectedRoute>
          }
        />
        {/* ==========================
              404 ROUTE
        ========================== */}

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
          path="/recruiter/candidate/:id"
          element={
            <RecruiterProtectedRoute>
              <RecruiterCandidate />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/create-job"
          element={
            <RecruiterProtectedRoute>
              <CreateJob />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/my-jobs"
          element={
            <RecruiterProtectedRoute>
              <MyJobs />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <RecruiterProtectedRoute>
              <ViewJob />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/coding"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CodingRound />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
