import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const savedToken = localStorage.getItem('rd_access_token');
const savedUser = localStorage.getItem('rd_user')
  ? JSON.parse(localStorage.getItem('rd_user'))
  : null;

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue({
      status: err.response?.status,
      message: err.response?.data?.message || 'Failed to fetch user',
    });
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('rd_access_token');
  localStorage.removeItem('rd_user');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    accessToken: savedToken,
    isAuthenticated: !!savedToken && !!savedUser,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('rd_access_token', accessToken);
      localStorage.setItem('rd_user', JSON.stringify(user));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('rd_user', JSON.stringify(state.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('rd_access_token');
      localStorage.removeItem('rd_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('rd_user', JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        // Keep the session during transient network/rate-limit failures.
        // Only an explicit 401 means the stored access token is invalid.
        if (action.payload?.status !== 401) return;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('rd_access_token');
        localStorage.removeItem('rd_user');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, updateUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
