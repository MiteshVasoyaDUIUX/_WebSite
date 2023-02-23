import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isSuccess: false,
  isError: false,
  isPending: false,
  message: "",
};

//User Registration...
export const register = createAsyncThunk("register", async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

// export const logout = createAsyncThunk('auth/logout', async () => {
//     await authService.logout();
// });

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        window.alert("User Already Exists...");
        state.user = null;
      });
    // .addCase(login.pending, (state) => {
    //     state.isLoading = true;
    // })
    // .addCase(login.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.isSuccess = true;
    //     state.isError = false;
    //     state.user = action.payload;
    //     console.log(action.payload);
    // })
    // .addCase(login.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.isError = true;
    //     state.isSuccess = false;
    //     window.alert("Invalid Credentials...");
    //     state.message = action.payload;
    //     state.user = null
    // })
    // .addCase(logout.fulfilled, (state) => {
    //     state.user = null
    // })
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
