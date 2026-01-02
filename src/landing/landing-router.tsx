import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPageV2 } from "@/landing/pages/landing-v2";

export const LandingRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPageV2 />} />
      <Route path="/v2" element={<LandingPageV2 />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
