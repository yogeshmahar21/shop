// hooks/useAuth.js
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setChecking(false);
  }, []);

  return { user, setUser, checking }; // ✅ return setUser too
}
