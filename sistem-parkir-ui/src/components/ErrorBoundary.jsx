// src/components/ErrorBoundary.jsx

import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function ErrorBoundary() {
  const error = useRouteError();

  // Determine error type
  const is404 = error?.status === 404;
  const errorMessage =
    error?.statusText || error?.message || "Terjadi kesalahan";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6"
          >
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
          </motion.div>

          {/* Error Code */}
          {is404 ? (
            <>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-8xl font-extrabold text-gray-900 mb-4"
              >
                404
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                Halaman Tidak Ditemukan
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-8"
              >
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin
                halaman telah dipindahkan atau dihapus.
              </motion.p>
            </>
          ) : (
            <>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                Oops! Terjadi Kesalahan
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8"
              >
                {errorMessage}
              </motion.p>
            </>
          )}

          {/* Error Details (Dev Mode) */}
          {import.meta.env.DEV && error?.stack && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-left mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                Detail Error (Development Mode)
              </summary>
              <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                {error.stack}
              </pre>
            </motion.details>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Kembali
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <HomeIcon className="w-5 h-5" />
              Ke Halaman Utama
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm text-gray-500"
          >
            Jika masalah terus berlanjut, silakan hubungi administrator sistem.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
