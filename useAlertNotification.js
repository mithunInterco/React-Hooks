import { useEffect } from "react";
import { useSnackbar } from "notistack";

const useAlertNotification = ({
  alert,
  successAlert,
  setAlert,
  setSuccessAlert,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (alert) {
      enqueueSnackbar("Please fill out all required fields", {
        variant: "error",
      });
      const timeout = setTimeout(() => {
        setAlert(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (successAlert) {
      enqueueSnackbar("PO Edited Successfully", {
        variant: "success",
      });
      const timeout = setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert, successAlert, enqueueSnackbar, setAlert, setSuccessAlert]);
};

export default useAlertNotification;
