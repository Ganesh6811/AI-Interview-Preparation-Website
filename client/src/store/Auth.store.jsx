import { create } from "zustand";
import baseUrl from "../config.jsx"; 
import axios from "axios";


const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isLoading: false,
  userId: "",
  name: "",
  email: "", 

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`${baseUrl}/auth/checkAuth`, {
        withCredentials: true,
      });
      const { _id, name, email } = data;

      set({
        userId: _id,
        name,
        email,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
    
      console.log("Error in AuthStore:", err);
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  logOut: () => {
    set({
      userId: "",
      name: "",
      email: "",
      isAuthenticated: false,
      isLoading: false,
    });
  }
}));

export default useAuthStore;
