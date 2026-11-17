import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FormsNewPage as FormsPage } from "../pages/forms/forms";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={ <FormsPage />} />
      </Route>
    </Routes>
  )
}
