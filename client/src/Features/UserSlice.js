import { UsersData } from "../ExampleData";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//const initialState = { value: [] }; //list of user is an object wih empty array as initial value

//const initialState = { value: UsersData };
const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const login = createAsyncThunk("users/login", async (userData) => {
  try {
    const response = await axios.post(`https://myproject-server.onrender.com/login`, {
      email: userData.email,
      password: userData.password,
    });

    const user = response.data.user;
    console.log(response);
    return user;
  } catch (error) {
    //handle the error
    const errorMessage = "Invalid credentials";
    alert(errorMessage);
    throw new Error(errorMessage);
  }
});

export const logout = createAsyncThunk("/users/logout", async () => {
  try {
    // Send a request to your server to log the user out
    const response = await axios.post(`https://myproject-server.onrender.com/logout`);
  } catch (error) {}
});

export const registerUser = createAsyncThunk("users/registerUser",
  async(userData)=>
  {
    try
    {
      const response = await axios.post(`https://myproject-server.onrender.com/registerUser`,
        {
          name:userData.name,
          email:userData.email,
          password:userData.password,
        }
      );
      console.log(response);
      const user = response.data.user; 
      return(user);
    }
    catch(error)
    {
      console.log(error);
    }
  }
);

/*export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile", // Action type string for Redux
  async (userData) => {
    try {
        const response = await axios.put(
        `http://localhost:3001/updateUserProfile/${userData.email}`, // API endpoint for updating user profile
        {
          // Request payload with user data to be updated
          email: userData.email,
          name: userData.name,
          password: userData.password,
          profilePic: userData.profilePic,
        },
        {
          headers: {  //headers is necessary when uploading files with form-data in a request.
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      // Extract the updated user data from the server response
      const user = response.data.user;

      // Return the updated user data, which will be used by Redux to update the state
      return user;
    } catch (error) {
      // Log any errors that occur during the request
      console.log(error);
    }
  }
);*/
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (formData) => {
    try {
      const response = await axios.put(
        `https://myproject-server.onrender.com/updateUserProfile/${formData.get("email")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const userSlice = createSlice({
  name: "users", //name of the state
  initialState,
  reducers: {
    addUser: (state, action) => {
      //state is the current value of the state, action is triggered outside the reducer and provide a value to the reducer
      state.value.push(action.payload); //add the payload to the state the payload is the value coming from the component
    },
    deleteUser: (state, action) => {
      console.log(action);
      state.value = state.value.filter((user) => user.email !== action.payload); //create a new array with the value that excludes the user with the email value from the action payload, and assign the new array to the state.
    },
    updateUser: (state, action) => {
      console.log(action);
      state.value.map((user) => {
        //iterate the  array and compare the email with the email from the payload
        if (user.email === action.payload.email) {
          user.name = action.payload.name;
          user.password = action.payload.password;
        }
      });
    },
  },
  extraReducers: (builder) => {
    //Asynchronous actions that update the state directly,
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
  
  .addCase(login.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(login.fulfilled, (state, action) => {
    state.user = action.payload; //assign the payload which is the user object return from the server after authentication
    state.isLoading = false;
    state.isSuccess = true;
  })
  .addCase(login.rejected, (state) => {
    state.isLoading = false;
    state.isError = true;
  })
  .addCase(logout.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(logout.fulfilled, (state) => {
    // Clear user data or perform additional cleanup if needed
    state.user = {};
    state.isLoading = false;
    state.isSuccess = false;
  })
  .addCase(logout.rejected, (state) => {
    state.isLoading = false;
    state.isError = true;
  })
  .addCase(updateUserProfile.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(updateUserProfile.fulfilled, (state, action) => {
    state.user = action.payload;
    state.isLoading = false;
  })
  .addCase(updateUserProfile.rejected, (state) => {
    state.isLoading = false;
    state.isError = true;
  })


},


});
export const { addUser, deleteUser, updateUser } = userSlice.actions; //export the function

export default userSlice.reducer;
