import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { IPost } from "../types";
import { PostItem } from "../components/PostItem";
import { CategoriesList } from "../components/CategoryList";
import { PostsList } from "../components/PostList";
import { CategoriesAccordion } from "../components/CategoriesAccordion";

export const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    const postsCollectionRef = collection(db, "posts");
    const data = await getDocs(postsCollectionRef);
    const list = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IPost[];
    setPosts(list);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const deletePost = async (id: string) => {
    await deleteDoc(doc(db, "posts", id));
    await getPosts();
  };

  return (
    <div className="home-page">
      <h1>Список постов</h1>
      <CategoriesAccordion />
      <CategoriesList />
      <PostsList />
      <div className="post-list">
        {posts.length > 0 && posts.map((post) => <PostItem key={post.id} post={post} deletePost={deletePost} />)}
      </div>
    </div>
  );
};