import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Hook to display online/offline status
const useOnlineStatus = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const handleOnline = () => {
      enqueueSnackbar("You are back online!", { variant: "success" });
    };

    const handleOffline = () => {
      enqueueSnackbar("You are currently offline!", { variant: "error" });
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [enqueueSnackbar]);
};

// Hook to display login error and redirect if userError is true
const useLoginError = (userError) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useOnlineStatus();

  useEffect(() => {
    if (userError) {
      enqueueSnackbar("Please Login Again", {
        variant: "error",
      });

      // Redirect to home page
      navigate("/");
    }
  }, [userError, enqueueSnackbar, navigate]);
};

export default useLoginError;
