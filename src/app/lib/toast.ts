/* eslint-disable import/no-extraneous-dependencies */
import { toast } from "react-hot-toast";

enum ToastPosition {
  TOPRIGHT = "top-right",
  TOPLEFT = "top-left",
  TOPCENTER = "top-center",
  BOTTOMLEFT = "bottom-left",
  BOTTOMRIGHT = "bottom-right",
  BOTTOMCENTER = "bottom-center",
}
interface ToastProps {
  msg: string;
  position?: ToastPosition;
}

const mtToastStyle = {
  style: {
    fontSize: "14px",
    fontWeight: "medium",
    backgroundColor: "white",
    color: "#26282c",
  },
};

export const ChimoneyToast = {
  success: ({ msg, position = ToastPosition.TOPRIGHT }: ToastProps) => {
    const toastId = toast.success(msg, {
      position,
      duration: 6000,
      ...mtToastStyle,
    });
    return toastId;
  },

  error: ({ msg, position = ToastPosition.TOPRIGHT }: ToastProps) => {
    const toastId = toast.error(msg, {
      duration: 6000,
      position,
      ...mtToastStyle,
    });
    return toastId;
  },

  warn: ({ msg, position = ToastPosition.TOPRIGHT }: ToastProps) => {
    const toastId = toast.custom(msg, {
      position,
      duration: 6000,
      style: {
        backgroundColor: "white",
        fontSize: "15px",
        color: "yellow",
      },
      className: "bg-primary-60 text-neutral white",
    });
    return toastId;
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

const milliSeconds = 2500;
export const showToastError = (msg: string) => {
  const toastId = ChimoneyToast.error({
    msg: msg,
  });
  setTimeout(() => ChimoneyToast.dismiss(toastId), milliSeconds);
};

export const showToastSuccess = (msg: string) => {
  const toastId = ChimoneyToast.success({
    msg: msg,
  });
  setTimeout(() => ChimoneyToast.dismiss(toastId), milliSeconds);
};
