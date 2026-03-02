import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./layouts/Layout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ClassManagement from "./pages/ClassManagement";
import StudentManagement from "./pages/StudentManagement";
import StudentProfile from "./pages/StudentProfile";
import TeacherManagement from "./pages/TeacherManagement";
import Attendance from "./pages/Attendance";
import FeeCollection from "./pages/FeeCollection";
import ClassAttendanceReport from "./pages/ClassAttendanceReport";
import StudentAttendanceDetail from "./pages/StudentAttendanceDetail";
import StudentAttendanceAnalysis from "./pages/StudentAttendanceAnalysis";
import SubjectMaster from "./pages/SubjectMaster";
import ClassSubjectMapping from "./pages/ClassSubjectMapping";
import TimetableManagement from "./pages/TimetableManagement";
import TeacherTimetableView from "./pages/TeacherTimetableView";

// Protected Route Wrapper

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClassManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/:studentId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teachers"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TeacherManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Attendance />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fees"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FeeCollection />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/attendance"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClassAttendanceReport />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/attendance/student/:studentId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentAttendanceDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/attendance/analysis/student/:studentId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentAttendanceAnalysis />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/academic/subjects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubjectMaster />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/academic/mappings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClassSubjectMapping />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default Redirect */}

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 - For now redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/academic/timetable"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TimetableManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/timetable"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TeacherTimetableView />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
