import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { AppProvider } from "./context/AppContext";
import { SaaSLayout } from "./components/layout/SaaSLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { PDFLibrary } from "./pages/PDFLibrary";
import { ReaderSplit } from "./pages/ReaderSplit";
import { Collections } from "./pages/Collections";
import { NotificationsSettings } from "./pages/NotificationsSettings";
import { ProfileSettings } from "./pages/ProfileSettings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { supabase } from "./utils/supabase/supabase";
import NotFoundPage from "./pages/NotFoundPage";
import { LandingPage } from "./pages/LandingPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { OtherProvider } from "./context/OtherContext";
import ChatHome from "./pages/ChatHome";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthProvider>
          <OtherProvider>
            <Routes>
              {/* Public Auth routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Secure SaaS interior routes with layouts */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <SaaSLayout>
                      <Routes>
                        <Route index element={<DashboardHome />} />
                        <Route path="pdfs" element={<PDFLibrary />} />
                        <Route path="chat" element={<ChatHome />} />
                        <Route path="reader" element={<ReaderSplit />} />
                        <Route path="collections" element={<Collections />} />
                        <Route
                          path="notifications"
                          element={<NotificationsSettings />}
                        />
                        <Route path="profile" element={<ProfileSettings />} />

                        {/* Catchall redirect */}
                      </Routes>
                    </SaaSLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </OtherProvider>
        </AuthProvider>
      </BrowserRouter>
    </AppProvider>
  );
}
