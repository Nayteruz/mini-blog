import { Route, Routes } from "react-router-dom";
import { CreatePost, Home, NotFoundPage, SignIn, EditPostForm, CategoriesPage } from "./pages";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/edit-post/:postId" element={<EditPostForm />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};