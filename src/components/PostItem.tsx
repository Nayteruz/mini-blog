import { useState, type FC } from "react";
import type { IPost } from "../types";
import Delete from "../assets/icons/deleteIcon.svg?react";

interface IPostItemProps {
  post: IPost
  deletePost: (id: string) => void
}

export const PostItem: FC<IPostItemProps> = ({ post, deletePost }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="post-item">
      <button className="delete-post-button" onClick={() => deletePost(post.id)}><Delete /></button>
      <h2 onClick={toggleOpen}>{post.title}</h2>
      {isOpen && <p className="post-note" dangerouslySetInnerHTML={{ __html: post.text }} />}
    </div >
  );
}