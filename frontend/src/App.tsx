import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandingPage } from "@/pages/LandingPage";
import { PatientDashboard } from "@/pages/PatientDashboard";
import { UploadPage } from "@/pages/UploadPage";
import { AnalysisPage } from "@/pages/AnalysisPage";
import { ChatbotPage } from "@/pages/ChatbotPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AuthPage } from "@/pages/AuthPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AppointmentPage } from "@/pages/AppointmentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<AuthPage mode="login" />}
        />

        <Route
          path="/register"
          element={<AuthPage mode="register" />}
        />

        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<PatientDashboard />}
          />

          <Route
            path="upload"
            element={<UploadPage />}
          />

          <Route
            path="analysis"
            element={<AnalysisPage />}
          />

          <Route
            path="chat"
            element={<ChatbotPage />}
          />

          <Route
            path="history"
            element={<HistoryPage />}
          />

          <Route
            path="profile"
            element={<ProfilePage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>

        {/* Appointment - direct top-level route */}
        <Route
          path="/dashboard/appointments"
          element={
            <DashboardLayout />
          }
        >
          <Route
            index
            element={<AppointmentPage />}
          />
        </Route>

        {/* Unknown Page */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}