import { configureStore, createSlice } from "@reduxjs/toolkit";

// Define initial state for authentication
interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

// Define authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;

      const loginHash = process.env.NEXT_PUBLIC_LOGIN_HASH;
      const now = new Date();
      const expirationTime = now.getTime() + 3600 * 1000; // One hour in milliseconds
      now.setTime(expirationTime);

      document.cookie = `authToken=${loginHash}; expires=${now.toUTCString()}; path=/`;
      window.location.href = "/";
    },
    logout(state) {
      state.isAuthenticated = false;
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      window.location.href = "/";
    },
  },
});

// Export actions from slice
export const { loginSuccess, logout } = authSlice.actions;

// Configure store with auth slice reducer
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // Add other reducers if any
  },
});

// Export types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
