import { useState, type FC } from "react";
import type { IPost } from "@/types"
import { Heading } from "@/components/Heading"
import { HTMLText } from "@/components/HTMLText";
import { ArrowToggle } from "@/components/ArrowToggle";
import styles from "./PostLeft.module.css"

interface IPostLeftProps {
  post: IPost;
}

export const PostLeft: FC<IPostLeftProps> = ({ post }) => {
  const { title, text } = post;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.PostLeft}>
      <div className={styles.titleWrapper} onClick={toggle}>
        <Heading as="h3" className={styles.title}>{title}</Heading>
        <ArrowToggle className={styles.arrow} isOpen={isOpen} />
      </div>
      {isOpen && <div className={styles.textWrapper}>
        <HTMLText htmlText={text} className={styles.text} />
      </div>}
    </div>
  )
}