import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import UserDashboard from "./pages/user/UserDashboard";
import Verification from "./pages/user/Verification";
import VerificationResult from "./pages/user/VerificationResult";
import OTPFallback from "./pages/user/OTPFallback";
import ManualReview from "./pages/user/ManualReview";
import VerificationHistory from "./pages/user/VerificationHistory";
import Profile from "./pages/user/Profile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVoters from "./pages/admin/AdminVoters";
import AdminVerifications from "./pages/admin/AdminVerifications";
import AdminManualReview from "./pages/admin/AdminManualReview";
import AdminRiskMonitor from "./pages/admin/AdminRiskMonitor";
import AdminBlockchain from "./pages/admin/AdminBlockchain";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />
        <Route
        path="/user/verify"
        element={<Verification />}
        />
        <Route
         path="/user/verification-result"
        element={<VerificationResult />}
        />
      <Route
      path="/user/fallback"
      element={<OTPFallback />}
      />
      <Route
      path="/user/manual-review"
      element={<ManualReview />}
      />
      <Route
      path="/user/history"
      element={<VerificationHistory />}
      />
      <Route
      path ="/user/profile"
      element={<Profile />}
      />
      <Route
      path="/admin/login"
      element={<AdminLogin />}
      />
      <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
      />
      <Route
      path="/admin/voters"
      element={<AdminVoters />}
      />
      <Route
      path="/admin/verifications"
      element={<AdminVerifications />}
      />
      <Route
      path="/admin/manual-review"
      element={<AdminManualReview />}
      />
      <Route
      path="/admin/risk"
      element={<AdminRiskMonitor />}
      />
      <Route
      path="/admin/blockchain"
      element={<AdminBlockchain />}
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;