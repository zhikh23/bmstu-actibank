import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FormsPage } from "@/pages/forms/forms/FormsPage";
import { NewFormPage } from "@/pages/forms/new/NewFormPage";
import { EventsPage } from "@/pages/events/events/EventsPage";
import { CatalogPage } from "@/pages/catalog/catalog/CatalogPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/forms" replace />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/forms/new" element={<NewFormPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Route>
    </Routes>
  )
}
