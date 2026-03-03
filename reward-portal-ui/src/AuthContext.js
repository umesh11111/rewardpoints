// import { createContext, useState, useEffect } from "react";
// import { setAuthToken } from "./api";
//
// export const AuthContext = createContext();
//
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//
//   useEffect(() => {
//     const saved = localStorage.getItem("auth");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setAuthToken(parsed.token);
//       setUser(parsed);
//     }
//   }, []);
//
//   const login = (token, role) => {
//     const auth = { token, role };
//     localStorage.setItem("auth", JSON.stringify(auth));
//     setAuthToken(token);
//     setUser(auth);
//   };
//
//   const logout = () => {
//     localStorage.removeItem("auth");
//     setAuthToken(null);
//     setUser(null);
//   };
//
//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import { setAuthToken } from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // restore session on refresh
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAuthToken(parsed.token);
      setUser(parsed);
    }
  }, []);

  const login = (token, role, employee_id, status) => {
    const auth = {
      token,
      role,
      employee_id,
      status
    };

    localStorage.setItem("auth", JSON.stringify(auth));
    setAuthToken(token);
    setUser(auth);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};