import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/configDb";
import { ArrowToggle } from "@/components/ArrowToggle";
import DeleteIcon from "@assets/icons/deleteIcon.svg?react";
import EditIcon from "@assets/icons/penToSquare.svg?react";
import { Button } from "@/components/Button";
import { usePosts } from "@hooks/usePosts";
import { HTMLText } from "@components/HTMLText";
import { PAGES } from "@/contants";
import type { IPostCardProps } from "./types";
import { OwnCategories } from "../OwnCategories/OwnCategories";
import styles from "./PostCard.module.css";

export const PostCard: FC<IPostCardProps> = ({ post, className, style, isToggle, parts, ownCategories = [] }) => {
  const navigate = useNavigate();
  const { deletePost } = usePosts();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthor = auth.currentUser?.uid === post.author.id;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const onEdit = () => {
    navigate(`${PAGES.POST_EDIT.pathOrigin}/${post.id}`);
  };

  const onDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить пост "${post.title}"?`)) {
      deletePost(post.id);
    }
  };

  const classes = {
    wrap: `${styles.Card}${className ? ` ${className}` : ""}`,
    content: `${styles.cardContent}${!isToggle ? ` ${styles.open}` : ""}${isToggle && isOpen ? ` ${styles.open}` : ""}`,
    footer: `${styles.cardFooter}${!isToggle ? ` ${styles.open}` : ""}${isToggle && isOpen ? ` ${styles.open}` : ""}`,
  };

  return (
    <div className={classes.wrap} style={style}>
      <div
        className={styles.cardHeader}
        onClick={isToggle ? toggleOpen : undefined}
        style={{ cursor: isToggle ? "pointer" : "auto" }}
      >
        <span>{post.title}</span>
        {isToggle && <ArrowToggle isOpen={isOpen} className={styles.arrow} />}
      </div>
      <div className={classes.content}>
        {parts.includes("category") && <OwnCategories categories={ownCategories} label='Категории:' />}
        <HTMLText htmlText={post.text} className={styles.htmlText} />
        {!parts.includes("footer") && (
          <div className={styles.editWrap}>
            <Link className={styles.link} to={`${PAGES.POST_EDIT.pathOrigin}/${post.id}`}>
              ✎
            </Link>
          </div>
        )}
        {parts.includes("meta") && (
          <div className={styles.meta}>
            <span className={styles.metaName}>Автор: {post.author.name || "Аноним"}</span>
            <span className={styles.metaDate}>
              {post.createdAt?.toDate?.()?.toLocaleDateString("ru-RU") || "Неизвестно"}
            </span>
          </div>
        )}
      </div>
      {parts.includes("footer") && isAuthor && (
        <div className={classes.footer}>
          <div className={styles.buttons}>
            <Button variant='primary' size='square' onClick={onEdit}>
              <EditIcon className={styles.icon} />
            </Button>
            <Button variant='danger' size='square' onClick={onDelete}>
              <DeleteIcon className={styles.icon} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
