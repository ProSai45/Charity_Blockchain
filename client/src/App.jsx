import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/AppShell";
import CampaignDetailPage from "@/pages/CampaignDetailPage";
import CampaignsPage from "@/pages/CampaignsPage";
import DonorDashboardPage from "@/pages/DonorDashboardPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import VerifierPanelPage from "@/pages/VerifierPanelPage";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:campaignId" element={<CampaignDetailPage />} />
        <Route path="/donor" element={<DonorDashboardPage />} />
        <Route path="/verifier" element={<VerifierPanelPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
