import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { FormsPage } from '@/pages/forms/list/FormsPage';
import { NewFormPage } from '@/pages/forms/new/NewFormPage';
import { EventsPage } from '@/pages/events/list/EventsPage';
import { CatalogPage } from '@/pages/catalog/catalog/CatalogPage';
import { FormSummaryPage } from '@/pages/forms/detail/FormSummaryPage';
import { EditFormPage } from '@/pages/forms/edit/EditFormPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/forms" replace />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/forms/new" element={<NewFormPage />} />
        <Route path="/forms/:id/edit" element={<EditFormPage />} />
        <Route path="/forms/:id" element={<FormSummaryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Route>
    </Routes>
  );
}
