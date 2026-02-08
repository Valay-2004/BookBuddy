import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

// Auth reducer for predictable state management
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case "TOKEN_EXPIRED":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Initialize state from localStorage
const getInitialState = () => {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");
  
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!(savedUser && savedToken),
  };
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, null, getInitialState);

  // Track token expiry timer
  useEffect(() => {
    let timer;
    try {
      if (state.token) {
        const payload = JSON.parse(atob(state.token.split(".")[1]));
        if (payload && payload.exp) {
          const expiresAt = payload.exp * 1000;
          const now = Date.now();
          const ms = expiresAt - now;
          if (ms <= 0) {
            // Token already expired
            dispatch({ type: "TOKEN_EXPIRED" });
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          } else {
            timer = setTimeout(() => {
              dispatch({ type: "TOKEN_EXPIRED" });
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            }, ms);
          }
        }
      }
    } catch (err) {
      // Ignore malformed token
    }
    return () => clearTimeout(timer);
  }, [state.token]);

  // Sync user to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  // Sync token to localStorage
  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  const login = (userData, jwtToken) => {
    dispatch({ 
      type: "LOGIN", 
      payload: { user: userData, token: jwtToken } 
    });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ 
      user: state.user, 
      token: state.token, 
      isAuthenticated: state.isAuthenticated,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
