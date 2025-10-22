import { Route, Routes } from "react-router-dom";
import { CreatePost, Home, NotFoundPage, SignIn } from "./pages";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};