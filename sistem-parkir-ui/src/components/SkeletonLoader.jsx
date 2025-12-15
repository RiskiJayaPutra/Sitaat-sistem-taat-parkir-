// src/components/SkeletonLoader.jsx

import React from "react";
import { motion } from "framer-motion";

// Card Skeleton
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {[...Array(columns)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        {/* Rows */}
        <div className="divide-y divide-gray-200">
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {[...Array(columns)].map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// List Skeleton
export const ListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded-full w-20"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Form Skeleton
export const FormSkeleton = () => {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-100">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        {/* Form Fields */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="rounded-xl bg-blue-600 p-6 shadow-xl">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-blue-500 rounded w-2/3"></div>
          <div className="h-4 bg-blue-500 rounded w-1/2"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardSkeleton count={3} />

      {/* Content */}
      <ListSkeleton count={4} />
    </div>
  );
};

export default {
  CardSkeleton,
  TableSkeleton,
  StatsCardSkeleton,
  ListSkeleton,
  FormSkeleton,
  DashboardSkeleton,
};
