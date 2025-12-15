// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  // Varian animasi untuk container (stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Muncul berurutan setiap 0.3 detik
      },
    },
  };

  // Varian animasi untuk item anak
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-gray-50 to-gray-100">
      {/* Navbar Sederhana dengan animasi turun */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="sticky top-0 z-10 bg-white/80 py-4 shadow-sm backdrop-blur-md"
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-indigo-600 p-2">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              SITAAT <span className="text-indigo-600">FT</span>
            </h1>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="rounded-full bg-gray-100 px-6 py-2.5 font-semibold text-gray-700 transition duration-300 hover:bg-gray-200"
            >
              Login User
            </Link>
            <Link
              to="/gerbang"
              className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white transition duration-300 hover:bg-indigo-700 hover:shadow-lg"
            >
              <QrCodeIcon className="mr-2 h-5 w-5" />
              Simulator Gerbang
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-center"
        >
          <motion.span
            variants={itemVariants}
            className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700"
          >
            🚀 Sistem Keamanan Parkir Terpadu
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mb-6 text-5xl font-extrabold leading-tight text-gray-900 md:text-7xl"
          >
            Wujudkan Parkir Tertib di <br />
            <span className="text-blue-600">Fakultas Teknik</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mb-10 text-xl text-gray-600 md:px-20"
          >
            Platform digital untuk melaporkan pelanggaran, memantau sanksi, dan
            menjaga ketertiban lingkungan kampus kita bersama.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-4"
          >
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-2xl active:scale-95"
            >
              <span className="mr-2">Mulai Lapor Sekarang</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="py-6 text-center text-gray-500"
      >
        <p>
          © {new Date().getFullYear()} Fakultas Teknik Universitas Lampung.
          Created with ❤️ by Mahasiswa.
        </p>
      </motion.footer>
    </div>
  );
}
