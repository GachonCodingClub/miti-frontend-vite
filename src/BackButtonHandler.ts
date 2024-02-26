import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";

const BackButtonHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const registerBackButton = async () => {
      const backListener = await CapacitorApp.addListener("backButton", () => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      });

      return () => backListener.remove();
    };

    registerBackButton();
  }, [navigate]);

  return null;
};

export default BackButtonHandler;
