
import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const BASEURL = "http://localhost:8000";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch thông tin User từ Backend
  const fetchUser = async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authFetch(`${BASEURL}/api/profile`);

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Cập nhật lại thông tin sau khi đăng nhập
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  // Xóa thông tin User khi đăng xuất
  const clearUser = () => {
    setUser(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{ user, loading, fetchUser, refreshUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
