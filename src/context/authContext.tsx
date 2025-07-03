import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

type Action =
  | {
      type: "LOGIN";
      payload: { user: any; accessToken: string; refreshToken: string };
    }
  | { type: "LOGOUT" }
  | { type: "REFRESH_TOKEN"; payload: { accessToken: string } };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case "REFRESH_TOKEN":
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
