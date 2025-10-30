import { Route, Routes } from "react-router-dom";
import { PostCreate, Home, NotFoundPage, SignIn, PostEdit, CategoriesPage, PostList } from "./pages";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-post" element={<PostCreate />} />
      <Route path="/post-list" element={<PostList />} />
      <Route path="/edit-post/:postId" element={<PostEdit />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};