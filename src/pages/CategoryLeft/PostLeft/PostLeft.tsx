import { useState, type FC } from "react";
import type { IPost } from "@/types"
import { Heading } from "@/components/Heading"
import { HTMLText } from "@/components/HTMLText";
import styles from "./PostLeft.module.css"
import { ArrowToggle } from "@/components/ArrowToggle";

interface IPostLeftProps {
  post: IPost;
}

export const PostLeft: FC<IPostLeftProps> = ({ post }) => {
  const { title, text } = post;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.PostLeft}>
      <div className={styles.titleWrapper}>
        <Heading as="h3" className={styles.title}>{title}</Heading>
        <ArrowToggle className={styles.arrow} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>
      {isOpen && <div className={styles.textWrapper}>
        <HTMLText htmlText={text} className={styles.text} />
      </div>}
    </div>
  )
}