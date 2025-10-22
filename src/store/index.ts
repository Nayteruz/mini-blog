import { create } from "zustand";
import { auth } from "../firebase";
import { type User } from "firebase/auth";

interface Store {
	user: User | null;
	setUser: (user: any) => void;
	clearUser: () => void;
	getUserName: () => string;
	getIsAuth: () => boolean;
}

export const useStore = create<Store>((set, get) => ({
	user: auth.currentUser !== null ? auth.currentUser : null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
	getUserName: () => get().user?.displayName || "",
	getIsAuth: () => get().user !== null,
}));
