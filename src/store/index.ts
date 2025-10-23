import { create } from "zustand";
import { auth } from "../firebase";
import { type User } from "firebase/auth";
import type { IPost } from "../types";

interface Store {
	user: User | null;
	setUser: (user: any) => void;
	clearUser: () => void;
	getUserName: () => string;
	getIsAuth: () => boolean;

	// Данные
	allPosts: IPost[];
	filteredPosts: IPost[];

	// Фильтры
	searchQuery: string;
	sortBy: "newest" | "oldest" | "title";
	selectedCategory: string;

	// Действия
	setAllPosts: (posts: IPost[]) => void;
	setFilteredPosts: (posts: IPost[]) => void;
	setSearchQuery: (query: string) => void;
	setSortBy: (sort: "newest" | "oldest" | "title") => void;
	setSelectedCategory: (categoryId: string) => void;
	clearFilters: () => void;

	// Вычисляемые свойства
	applyFilters: () => void;
}

export const useStore = create<Store>((set, get) => ({
	user: auth.currentUser !== null ? auth.currentUser : null,
	filteredPosts: [],
	allPosts: [],
	searchQuery: "",
	sortBy: "newest",
	selectedCategory: "all",
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
	getUserName: () => get().user?.displayName || "",
	getIsAuth: () => get().user !== null,

	// Сеттеры
	setAllPosts: (posts) => {
		set({ allPosts: posts });
		get().applyFilters();
	},
	setFilteredPosts: (posts) => set({ filteredPosts: posts }),

	setSearchQuery: (query) => {
		set({ searchQuery: query });
		get().applyFilters();
	},

	setSortBy: (sort) => {
		set({ sortBy: sort });
		get().applyFilters();
	},

	setSelectedCategory: (categoryId) => {
		set({ selectedCategory: categoryId });
		get().applyFilters();
	},

	clearFilters: () => {
		set({
			searchQuery: "",
			sortBy: "newest",
			selectedCategory: "all",
		});
		get().applyFilters();
	},

	// ВНУТРЕННЯЯ ФУНКЦИЯ ДЛЯ ФИЛЬТРАЦИИ
	applyFilters: () => {
		const { allPosts, searchQuery, sortBy, selectedCategory } = get();

		let result = [...allPosts];

		// Поиск по заголовку и тексту
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(post) => post.title.toLowerCase().includes(query) || post.text.toLowerCase().includes(query)
			);
		}

		// Фильтрация по категории
		if (selectedCategory !== "all") {
			result = result.filter((post) => post.categoryId === selectedCategory);
		}

		// Сортировка
		switch (sortBy) {
			case "newest":
				result.sort((a, b) => {
					const dateA = a.createdAt?.toDate?.() || new Date(0);
					const dateB = b.createdAt?.toDate?.() || new Date(0);
					return dateB.getTime() - dateA.getTime();
				});
				break;
			case "oldest":
				result.sort((a, b) => {
					const dateA = a.createdAt?.toDate?.() || new Date(0);
					const dateB = b.createdAt?.toDate?.() || new Date(0);
					return dateA.getTime() - dateB.getTime();
				});
				break;
			case "title":
				result.sort((a, b) => a.title.localeCompare(b.title));
				break;
		}

		set({ filteredPosts: result });
	},
}));
