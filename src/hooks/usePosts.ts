import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase";
import type { ICreatePostData, IPost } from "../types";

export const usePosts = () => {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

			setPosts(postsData);
		} catch (err) {
			console.error("Error loading posts:", err);
			setError("Ошибка загрузки постов");
		} finally {
			setLoading(false);
		}
	};

	// Создание нового поста
	const createPost = async (
		postData: Omit<ICreatePostData, "author" | "createdAt">,
		userId: string,
		userName: string | null
	) => {
		try {
			setError(null);

			const newPost: ICreatePostData = {
				...postData,
				author: {
					name: userName || "",
					id: userId,
				},
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

	useEffect(() => {
		loadPosts();
	}, []);

	return {
		posts,
		loading,
		error,
		refreshPosts: loadPosts,
		createPost,
		getPostsByCategory,
	};
};
