import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/AuthService";

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await AuthService.login(userData);
      console.log(result.data);
      const { user, access_token } = result.data;
      localStorage.setItem("token", access_token);
      return { user };
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.message);
    }
  },
);

export const registration = createAsyncThunk(
  "auth/registration",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await AuthService.registration(userData);
      console.log(result.data);
      const { user, access_token } = result.data;
      localStorage.setItem("token", access_token);
      return { user };
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.message);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.logout();
      localStorage.removeItem("token");
      console.log(result.data.message);
      return { message: result.data.message };
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.message);
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.refresh();
      const { user, access_token } = result.data;
      localStorage.setItem("token", access_token);
      console.log(result.data);
      return { user };
    } catch (e) {
      const msg = e?.response?.data?.message || "Что-то не так с сервером..";
      console.log(msg);
      return rejectWithValue(msg);
    }
  },
);

const createRequestState = () => ({
  isLoading: false,
  error: null,
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuth: false,
    isAuthChecked: false,
    isAuthError: null,
    login: createRequestState(),
    registration: createRequestState(),
    logout: createRequestState(),
  },
  reducers: {
    updateUserPhoto: (state, action) => {
      if (state.user) {
        state.user.photo_url = action.payload.photo_url;
        state.user.icon_url = action.payload.icon_url;
      }
    },
    activateUser: (state) => {
      if (state.user) {
        state.user.is_activated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
        state.login.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.login.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.isLoading = false;
        state.login.error = action.payload;
      });

    // REGISTRATION
    builder
      .addCase(registration.pending, (state) => {
        state.registration.isLoading = true;
        state.registration.error = null;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.registration.isLoading = false;
      })
      .addCase(registration.rejected, (state, action) => {
        state.registration.isLoading = false;
        state.registration.error = action.payload;
      });

    // LOGOUT
    builder
      .addCase(logout.pending, (state) => {
        state.logout.isLoading = true;
        state.logout.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.logout.isLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logout.error = action.payload;
        state.logout.isLoading = false;
      });

    // CHECK AUTH
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isAuthChecked = false;
        state.isAuthError = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuth = false;
        state.isAuthChecked = true;
        state.isAuthError = action.payload;
      });
  },
});

export const { updateUserPhoto, activateUser } = authSlice.actions;
export default authSlice.reducer;
