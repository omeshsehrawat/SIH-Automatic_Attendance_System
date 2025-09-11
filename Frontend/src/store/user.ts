import { create } from "zustand";

interface UserState {
    user: any;
    setUser: (user: any) => void;
    removeUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    setUser: (user: any) => set({ user}),
    removeUser: () => set({user: null})
}));
 

//useUserStore