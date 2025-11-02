import { Route, Routes } from "react-router-dom";
import { PostCreate, Home, NotFoundPage, SignIn, PostEdit, CategoriesPage, PostList, CategoryLeft } from "../pages";
import { AuthProtected } from "./AuthProtected";
import { PAGES } from "@/contants";

export const Router = () => {
  return (
    <Routes>
      <Route path={PAGES.MAIN.path} element={<Home />} />
      <Route element={<AuthProtected />}>
        <Route path={PAGES.POST_CREATE.path} element={<PostCreate />} />
        <Route path={PAGES.POST_EDIT.path} element={<PostEdit />} />
        <Route path={PAGES.CATEGORIES.path} element={<CategoriesPage />} />
      </Route>
      <Route path={PAGES.POST_LIST.path} element={<PostList />} />
      <Route path={PAGES.CATEGORIES_LEFT.path} element={<CategoryLeft />} />
      <Route path={PAGES.CATEGORIES_LEFT.pathOrigin} element={<CategoryLeft />} />
      <Route path={PAGES.SIGN_IN.path} element={<SignIn />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};