import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressService } from 'src/services/address.service';

// Async thunks for API calls
export const fetchAddresses = createAsyncThunk('addresses/fetchAddresses', async (userId, { rejectWithValue }) => {
  try {
    const addresses = await addressService.getAllAddresses(userId || null);
    return addresses;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to fetch addresses');
  }
});

export const createAddress = createAsyncThunk('addresses/createAddress', async ({ addressData, userId = null }, { rejectWithValue }) => {
  try {
    const address = await addressService.createAddress(addressData, userId);
    return address;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to create address');
  }
});

export const updateAddress = createAsyncThunk('addresses/updateAddress', async ({ id, addressData }, { rejectWithValue }) => {
  try {
    const address = await addressService.updateAddress(id, addressData);
    return address;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update address');
  }
});

export const deleteAddress = createAsyncThunk('addresses/deleteAddress', async (id, { rejectWithValue }) => {
  try {
    await addressService.deleteAddress(id);
    return id;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to delete address');
  }
});

export const setDefaultAddress = createAsyncThunk('addresses/setDefaultAddress', async (id, { rejectWithValue }) => {
  try {
    const address = await addressService.setDefaultAddress(id);
    return address;
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to set default address');
  }
});

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch addresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure only one default address per user
        const addresses = action.payload || [];
        const userDefaultMap = new Map();

        // Group addresses by user and ensure only one default per user
        const processedAddresses = addresses.map((addr) => {
          const userId = String(addr.user?._id || addr.user || addr.userId || '');

          if (addr.isDefault) {
            // If we already have a default for this user, unset this one
            if (userDefaultMap.has(userId)) {
              return { ...addr, isDefault: false };
            }
            userDefaultMap.set(userId, addr._id || addr.id);
          }

          return addr;
        });

        state.addresses = processedAddresses;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        const newAddress = action.payload;
        const addressUserId = newAddress.user?._id || newAddress.user || newAddress.userId;

        // Check if address already exists (avoid duplicates)
        const exists = state.addresses.some(
          (addr) => (addr._id === newAddress._id || addr.id === newAddress.id)
        );

        if (!exists) {
          state.addresses.push(newAddress);
        }

        // If this is set as default, unset others for the same user
        if (newAddress.isDefault) {
          const addressUserIdStr = String(addressUserId || '');
          state.addresses = state.addresses.map((addr) => {
            const addrUserIdStr = String(addr.user?._id || addr.user || addr.userId || '');
            const isSameUser = addrUserIdStr === addressUserIdStr;

            if (addr._id === newAddress._id || addr.id === newAddress.id) {
              return newAddress;
            }
            // Unset default for other addresses of the same user
            if (isSameUser && addr.isDefault) {
              return { ...addr, isDefault: false };
            }
            return addr;
          });
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        // ONLY UPDATE EXISTING RECORD, NO DUPLICATES
        const updatedAddress = action.payload;
        const updatedAddressId = updatedAddress._id || updatedAddress.id;
        const addressUserId = String(updatedAddress.user?._id || updatedAddress.user || updatedAddress.userId || '');

        // Update the address - replace existing, don't add duplicate
        state.addresses = state.addresses.map((addr) => {
          const addrId = addr._id || addr.id;
          const addrUserId = String(addr.user?._id || addr.user || addr.userId || '');
          const isSameUser = addrUserId === addressUserId;

          // Update the selected address - replace it with updated data
          if (addrId === updatedAddressId) {
            return updatedAddress;
          }

          // If this is set as default, unset others for the same user
          if (updatedAddress.isDefault && isSameUser && addr.isDefault) {
            return { ...addr, isDefault: false };
          }

          return addr;
        });
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload && addr.id !== action.payload
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Unset all other default addresses for the same user - ONLY UPDATE, NO DUPLICATES
        const updatedAddress = action.payload;
        const addressUserId = String(updatedAddress.user?._id || updatedAddress.user || updatedAddress.userId || '');
        const updatedAddressId = updatedAddress._id || updatedAddress.id;

        // Update addresses: set the selected one as default, unset all others for the same user
        // Only update existing addresses, don't add duplicates
        state.addresses = state.addresses.map((addr) => {
          const addrUserId = String(addr.user?._id || addr.user || addr.userId || '');
          const addrId = addr._id || addr.id;
          const isSameUser = addrUserId === addressUserId;

          // Update the selected address - replace it with updated data
          if (addrId === updatedAddressId) {
            return { ...updatedAddress, isDefault: true };
          }

          // Unset default for other addresses of the same user
          if (isSameUser && addr.isDefault) {
            return { ...addr, isDefault: false };
          }

          return addr;
        });
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;

