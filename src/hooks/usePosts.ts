import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import type { ICreatePostData, IPost, IUpdatePostData } from "../types";
import { db } from "../firebase";
import { useStore } from "../store";

export const usePosts = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Получаем действия из store
	const { setAllPosts, setSearchQuery, setSortBy, setSelectedCategory, clearFilters } = useStore();
	const store = useStore();

	// Загрузка всех постов
	const loadPosts = async () => {
		try {
			setLoading(true);
			setError(null);

			const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
			const querySnapshot = await getDocs(q);

			const postsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as IPost[];

			// Сохраняем посты в store
			setAllPosts(postsData);
		} catch (err) {
			console.error("Error loading posts:", err);
			setError("Ошибка загрузки постов");
		} finally {
			setLoading(false);
		}
	};

	// Создание нового поста
	const createPost = async (postData: Omit<ICreatePostData, "createdAt">) => {
		try {
			setError(null);

			const newPost: ICreatePostData = {
				...postData,
				createdAt: new Date(),
			};

			const docRef = await addDoc(collection(db, "posts"), newPost);
			await loadPosts(); // Перезагружаем список постов

			return docRef.id;
		} catch (err) {
			console.error("Error creating post:", err);
			setError("Ошибка создания поста");
			throw err;
		}
	};

	// УДАЛЕНИЕ ПОСТА
	const deletePost = async (postId: string) => {
		try {
			setError(null);

			await deleteDoc(doc(db, "posts", postId));
			await loadPosts(); // Перезагружаем список постов
		} catch (err) {
			console.error("Error deleting post:", err);
			setError("Ошибка удаления поста");
			throw err;
		}
	};

	// Получение постов по категории
	const getPostsByCategory = async (categoryId: string) => {
		try {
			const q = query(
				collection(db, "posts"),
				where("categoryPath", "array-contains", categoryId),
				orderBy("createdAt", "desc")
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IPost[];
		} catch (err) {
			console.error("Error loading posts by category:", err);
			throw err;
		}
	};

	// Обновление поста
	const updatePost = async (postId: string, updateData: IUpdatePostData) => {
		try {
			setError(null);

			const postUpdate: IUpdatePostData = {
				...updateData,
				updatedAt: new Date(),
			};

			await updateDoc(doc(db, "posts", postId), postUpdate);
			await loadPosts(); // Перезагружаем список постов
		} catch (err) {
			console.error("Error updating post:", err);
			setError("Ошибка обновления поста");
			throw err;
		}
	};

	// Функции для управления фильтрами - ОБНОВЛЯЕМ ТРИГГЕР
	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleSortChange = (sort: "newest" | "oldest" | "title") => {
		setSortBy(sort);
	};

	const handleCategoryFilter = (categoryId: string) => {
		setSelectedCategory(categoryId);
	};

	useEffect(() => {
		loadPosts();
	}, []);

	return {
		// Данные из store
		posts: store.filteredPosts,
		allPosts: store.allPosts,
		searchQuery: store.searchQuery,
		sortBy: store.sortBy,
		selectedCategory: store.selectedCategory,

		// Состояние загрузки и ошибки
		loading,
		error,

		// Действия
		refreshPosts: loadPosts,
		createPost,
		updatePost,
		deletePost,
		getPostsByCategory,
		handleSearch,
		handleSortChange,
		handleCategoryFilter,
		clearFilters,
	};
};
