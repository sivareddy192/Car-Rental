import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return [];
    try {
      const res = await api.get('/wishlist');
      return res.data.vehicles || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (vehicle, { dispatch, getState }) => {
    const { auth, wishlist } = getState();
    if (!auth.isAuthenticated) {
      toast.error('Please log in to save vehicles to your wishlist.');
      return;
    }

    const isSaved = wishlist.items.some((item) => item._id === vehicle._id);

    try {
      if (isSaved) {
        await api.delete(`/wishlist/${vehicle._id}`);
        dispatch(removeFromState(vehicle._id));
        toast.success(`Removed ${vehicle.name} from wishlist.`);
      } else {
        await api.post(`/wishlist/${vehicle._id}`);
        dispatch(addToState(vehicle));
        toast.success(`Saved ${vehicle.name} to wishlist.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update wishlist.');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isLoading: false,
  },
  reducers: {
    addToState: (state, action) => {
      const exists = state.items.some((item) => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromState: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { addToState, removeFromState, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
