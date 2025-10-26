import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { IPost } from "../types";
import { PostsList } from "../components/PostList";
import { AccordeonList } from "@/components/Category";

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

  return (
    <div className="home-page">
      <AccordeonList title="Категории с постами" />
      <PostsList />
    </div>
  );
};