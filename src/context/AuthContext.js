import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("lunara_token");
        const cachedUser = await AsyncStorage.getItem("lunara_user");

        if (token && cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      } catch (error) {
        console.log("Session restore error:", error);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({
      email,
      password,
    });

    await AsyncStorage.setItem("lunara_token", data.token);
    await AsyncStorage.setItem("lunara_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  }, []);

  // Register
  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);

    await AsyncStorage.setItem("lunara_token", data.token);
    await AsyncStorage.setItem("lunara_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  }, []);

  // Save Health Profile
  const completeHealthProfile = useCallback(async (payload) => {
    const { data } = await authApi.updateHealthProfile(payload);

    console.log("Updated user:", data.user);

    await AsyncStorage.setItem(
      "lunara_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data.user;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        "lunara_token",
        "lunara_user",
      ]);
    } catch (error) {
      console.log("Logout error:", error);
    }

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        initializing,
        login,
        register,
        completeHealthProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export default AuthContext;