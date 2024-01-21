import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = Boolean(localStorage.getItem("token"));
    if (!checkToken) {
      navigate("/sign-in");
    }
  }, [navigate]);
};
