import { useState, useEffect } from "react";

export const useLocalStorageToken = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    // 컴포넌트가 마운트 될 때 localStorage에서 토큰을 가져옴
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return token;
};
