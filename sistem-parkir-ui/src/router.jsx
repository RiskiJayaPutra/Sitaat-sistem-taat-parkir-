// src/router.jsx

import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardSwitcher from "./pages/DashboardSwitcher";
import BuatLaporanPage from "./pages/BuatLaporanPage";
import AdminManageMahasiswa from "./pages/AdminManageMahasiswa";
import AdminMahasiswaForm from "./pages/AdminMahasiswaForm";
import AdminManageSatpam from "./pages/AdminManageSatpam";
import MainLayout from "./layouts/MainLayout";
import GerbangSimulator from "./pages/GerbangSimulator";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  // === RUTE PUBLIK ===
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/gerbang",
    element: <GerbangSimulator />,
  },

  // === RUTE TERLINDUNGI (PROTECTED) ===
  {
    // Pathless Layout: MainLayout membungkus semua anak di bawahnya
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardSwitcher />,
      },
      {
        path: "/lapor",
        element: <BuatLaporanPage />,
      },
      {
        path: "/admin/mahasiswa",
        element: <AdminManageMahasiswa />,
      },
      {
        path: "/admin/mahasiswa/tambah",
        element: <AdminMahasiswaForm />,
      },
      {
        path: "/admin/mahasiswa/edit/:id",
        element: <AdminMahasiswaForm />,
      },
      {
        path: "/admin/satpam",
        element: <AdminManageSatpam />,
      },
    ],
  },
]);

export default router;
