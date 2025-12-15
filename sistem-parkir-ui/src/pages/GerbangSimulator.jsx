// src/pages/GerbangSimulator.jsx

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FingerPrintIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function GerbangSimulator() {
  const [npm, setNpm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = (e) => {
    e.preventDefault();
    if (!npm) return;

    setLoading(true);
    setHasil(null);
    setError(null);

    axios
      .get(`http://localhost:8000/api/cek-status/${npm}`)
      .then((response) => {
        setLoading(false);
        setHasil(response.data);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data) {
          setHasil(err.response.data);
        } else {
          setError("Gagal terhubung ke server gerbang.");
        }
      });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
              <FingerPrintIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              🅿️ E-Gate Simulator
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sistem Kontrol Akses Parkir
            </p>
          </motion.div>

          {/* Display Screen */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? "loading" : hasil ? "result" : "idle"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`mb-8 flex h-48 w-full flex-col items-center justify-center rounded-2xl border-4 text-center transition-all ${
                loading
                  ? "animate-pulse border-blue-500 bg-blue-900/20"
                  : hasil?.status === "Diizinkan"
                  ? "border-green-500 bg-green-900/20"
                  : hasil?.status === "Ditolak"
                  ? "border-red-500 bg-red-900/20"
                  : "border-gray-600 bg-gray-900"
              }`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FingerPrintIcon className="h-16 w-16 text-blue-400" />
                </motion.div>
              ) : hasil ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="space-y-3"
                >
                  {hasil.status === "Diizinkan" ? (
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-400" />
                  ) : (
                    <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
                  )}
                  <p
                    className={`text-4xl font-extrabold ${
                      hasil.status === "Diizinkan"
                        ? "text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {hasil.status === "Diizinkan"
                      ? "AKSES GRANTED"
                      : "AKSES DITOLAK"}
                  </p>
                  <p className="text-sm text-gray-300 px-4">{hasil.message}</p>
                </motion.div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-2">
                  <FingerPrintIcon className="mx-auto h-16 w-16 text-gray-600" />
                  <p className="text-xl font-medium text-gray-500">
                    Tempelkan Jari Anda
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Input Form */}
          <form onSubmit={handleScan} className="space-y-6">
            <div>
              <label
                htmlFor="npm"
                className="mb-2 block text-sm font-medium text-gray-400"
              >
                Simulasi Sidik Jari (Masukkan NPM)
              </label>
              <input
                type="text"
                id="npm"
                className="block w-full rounded-xl border-2 border-gray-600 bg-gray-700 p-4 text-center text-2xl font-bold text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                placeholder="Ketik NPM..."
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                autoComplete="off"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !npm}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              <FingerPrintIcon className="h-7 w-7" />
              {loading ? "Memindai..." : "SCAN SEKARANG"}
            </motion.button>
          </form>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          <p>Sistem Parkir Terpadu © 2024</p>
          <p className="mt-1">Fakultas Teknik UNILA</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
