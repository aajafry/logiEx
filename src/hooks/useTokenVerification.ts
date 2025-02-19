import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useTokenVerification = (token: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/authentication");
    }
  }, [navigate, token]);
};
