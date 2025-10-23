import { useState, type FC } from "react";
import type { IPost } from "../../types";

interface IAccordeonPostItemProps {
  post: IPost;
}

export const AccordeonPostItem: FC<IAccordeonPostItemProps> = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="post-item">
      <h4 className="post-item-title" onClick={toggleOpen}>
        {post.title}
        <div className="accordion-arrow">
          {isOpen ? '▼' : '►'}
        </div>
      </h4>
      <div className={`post-item-content ${isOpen ? 'open' : ''}`}>
        <p className="post-item-preview" dangerouslySetInnerHTML={{ __html: post.text }} />
        <div className="post-item-meta">
          <span className="post-author">Автор: {post.author.name || 'Аноним'}</span>
          <span className="post-date">
            {post.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Неизвестно'}
          </span>
        </div>
      </div>
    </div>
  );
};