import { useEffect, useRef, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IPostCardProps } from "./types";
import { ArrowToggle } from "../ArrowToggle";
import { Button } from "../Button";
import { usePosts } from "@hooks/usePosts";
import DeleteIcon from '@assets/icons/deleteIcon.svg?react';
import EditIcon from '@assets/icons/penToSquare.svg?react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import styles from './PostCard.module.css';

// Регистрируем языки
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);
hljs.registerLanguage('typescriptreact', typescript); // Регистрируем псевдоним
hljs.registerLanguage('tsx', typescript); // TSX как TypeScript

export const PostCard: FC<IPostCardProps> = ({ post, className, style, isToggle, parts, category }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { deletePost } = usePosts();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const onEdit = () => {
    navigate(`/edit-post/${post.id}`);
  }

  const onDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить пост "${post.title}"?`)) {
      deletePost(post.id);
    }
  }

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        try {
          hljs.highlightElement(block as HTMLElement);
        } catch (error) {
          console.warn('Highlight error:', error);
          // В случае ошибки просто оставляем как есть
        }
      });
    }
  }, [post.text]);

  const classes = {
    wrap: `${styles.Card}${className ? ` ${className}` : ''}`,
    content: `${styles.cardContent}${!isToggle ? ` ${styles.open}` : ''}${isToggle && isOpen ? ` ${styles.open}` : ''}`,
    footer: `${styles.cardFooter}${!isToggle ? ` ${styles.open}` : ''}${isToggle && isOpen ? ` ${styles.open}` : ''}`
  };


  return (
    <div className={classes.wrap} style={style}>
      <div className={styles.cardHeader} onClick={isToggle ? toggleOpen : undefined} style={{ cursor: isToggle ? 'pointer' : 'auto' }}>
        <span>{post.title}</span>
        {isToggle && <ArrowToggle isOpen={isOpen} className={styles.arrow} />}
      </div>
      <div className={classes.content}>
        {parts.includes('category') && <div className={styles.category}>Категория: <span>{category}</span></div>}
        <p ref={contentRef} className={`prose ${styles.cardPreview}`} dangerouslySetInnerHTML={{ __html: post.text }} />
        {!parts.includes('footer') && <div className={styles.editWrap}>
          <Link className={styles.link} to={`/edit-post/${post.id}`}>✎</Link>
        </div>}
        {parts.includes('meta') && <div className={styles.meta}>
          <span className={styles.metaName}>Автор: {post.author.name || 'Аноним'}</span>
          <span className={styles.metaDate}>
            {post.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Неизвестно'}
          </span>
        </div>}
      </div>
      {parts.includes('footer') && <div className={classes.footer}>
        <div className={styles.buttons}>
          <Button variant="primary" onClick={onEdit}><EditIcon className={styles.icon} /></Button>
          <Button variant="secondary" onClick={onDelete}><DeleteIcon className={styles.icon} /></Button>
        </div>
      </div>}
    </div>
  )
}