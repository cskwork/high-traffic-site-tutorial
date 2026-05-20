import { Routes, Route, Navigate } from "react-router-dom";
import { Shell } from "@/components/shell/Shell";
import { HomePage } from "@/routes/HomePage";
import { ConceptPage } from "@/routes/ConceptPage";
import { NotFoundPage } from "@/routes/NotFoundPage";
import { CreditsPage } from "@/routes/CreditsPage";

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn/:slug" element={<ConceptPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Shell>
  );
}
