// src/utils/toast.js
import { toast } from "react-toastify";

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...toastConfig,
      className: "bg-white",
      progressClassName: "bg-green-500",
    });
  },

  error: (message) => {
    toast.error(message, {
      ...toastConfig,
      className: "bg-white",
      progressClassName: "bg-red-500",
    });
  },

  info: (message) => {
    toast.info(message, {
      ...toastConfig,
      className: "bg-white",
      progressClassName: "bg-blue-500",
    });
  },

  warning: (message) => {
    toast.warning(message, {
      ...toastConfig,
      className: "bg-white",
      progressClassName: "bg-yellow-500",
    });
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        pending: messages.pending || "Loading...",
        success: messages.success || "Success!",
        error: messages.error || "Error occurred",
      },
      toastConfig
    );
  },
};
