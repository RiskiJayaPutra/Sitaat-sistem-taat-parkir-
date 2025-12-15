// src/router.jsx

import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import {
  DashboardSkeleton,
  FormSkeleton,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
} from "./components/SkeletonLoader";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardSwitcher = lazy(() => import("./pages/DashboardSwitcher"));
const BuatLaporanPage = lazy(() => import("./pages/BuatLaporanPage"));
const AdminManageMahasiswa = lazy(() => import("./pages/AdminManageMahasiswa"));
const AdminMahasiswaForm = lazy(() => import("./pages/AdminMahasiswaForm"));
const AdminManageSatpam = lazy(() => import("./pages/AdminManageSatpam"));
const AdminSatpamForm = lazy(() => import("./pages/AdminSatpamForm"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const GerbangSimulator = lazy(() => import("./pages/GerbangSimulator"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));

// Wrapper untuk Suspense
const SuspenseWrapper = ({ children, fallback = <DashboardSkeleton /> }) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

const router = createBrowserRouter([
  // === RUTE PUBLIK ===
  {
    path: "/",
    element: (
      <SuspenseWrapper fallback={<CardSkeleton />}>
        <LandingPage />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper fallback={<FormSkeleton />}>
        <LoginPage />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/gerbang",
    element: (
      <SuspenseWrapper fallback={<DashboardSkeleton />}>
        <GerbangSimulator />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary />,
  },

  // === RUTE TERLINDUNGI (PROTECTED) ===
  {
    // Pathless Layout: MainLayout membungkus semua anak di bawahnya
    element: (
      <SuspenseWrapper fallback={<div className="min-h-screen bg-gray-50" />}>
        <MainLayout />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: (
          <SuspenseWrapper>
            <DashboardSwitcher />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/lapor",
        element: (
          <SuspenseWrapper fallback={<FormSkeleton />}>
            <BuatLaporanPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/admin/mahasiswa",
        element: (
          <SuspenseWrapper fallback={<TableSkeleton rows={10} columns={6} />}>
            <AdminManageMahasiswa />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/admin/mahasiswa/tambah",
        element: (
          <SuspenseWrapper fallback={<FormSkeleton />}>
            <AdminMahasiswaForm />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/admin/mahasiswa/edit/:id",
        element: (
          <SuspenseWrapper fallback={<FormSkeleton />}>
            <AdminMahasiswaForm />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/admin/satpam",
        element: (
          <SuspenseWrapper fallback={<ListSkeleton count={10} />}>
            <AdminManageSatpam />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/admin/satpam/tambah",
        element: (
          <SuspenseWrapper fallback={<FormSkeleton />}>
            <AdminSatpamForm />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/admin/satpam/edit/:id",
        element: (
          <SuspenseWrapper fallback={<FormSkeleton />}>
            <AdminSatpamForm />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/profile",
        element: (
          <SuspenseWrapper fallback={<FormSkeleton />}>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

export default router;
