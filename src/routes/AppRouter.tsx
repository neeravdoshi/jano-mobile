import { Route, Routes } from "react-router-dom";

import { AppLayout } from "../shell/AppLayout";
import { SubPageLayout } from "../shell/SubPageLayout";
import { ChatPage } from "../pages/ChatPage";
import { DialysisPage } from "../pages/DialysisPage";
import { MedicationsPage } from "../pages/MedicationsPage";
import { NoteEditorPage } from "../pages/NoteEditorPage";
import { NotesPage } from "../pages/NotesPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { PrescriptionEditorPage } from "../pages/PrescriptionEditorPage";
import { PrescriptionsPage } from "../pages/PrescriptionsPage";
import { SystemPage } from "../pages/SystemPage";
import { TodayPage } from "../pages/TodayPage";
import { TrendsPage } from "../pages/TrendsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TodayPage />} />
        <Route
          path="/schedule"
          element={
            <PlaceholderPage
              eyebrow="Navigation"
              title="Schedule"
              message="The schedule view will be built from wireframes in a later pass. The route stays live so the bottom navigation can be tested now."
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PlaceholderPage
              eyebrow="Navigation"
              title="User"
              message="Profile and account settings will be added later once the core consultation flow is stable."
            />
          }
        />
        <Route path="/system" element={<SystemPage />} />
      </Route>
      <Route element={<SubPageLayout />}>
        <Route path="/dialysis" element={<DialysisPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/prescriptions/new" element={<PrescriptionEditorPage />} />
        <Route path="/prescriptions/:prescriptionId" element={<PrescriptionEditorPage />} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/new" element={<NoteEditorPage />} />
        <Route path="/notes/:noteId" element={<NoteEditorPage />} />
      </Route>
    </Routes>
  );
}
