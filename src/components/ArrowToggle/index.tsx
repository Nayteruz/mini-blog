import type { CSSProperties, FC } from "react"
import styles from "./ArrowToggle.module.css";

interface IArrowToggleProps {
  isOpen: boolean
  className?: string;
  style?: CSSProperties
}

export const ArrowToggle: FC<IArrowToggleProps> = ({ isOpen, className, style }) => {
  return (
    <div className={`${styles.arrow}${className ? ` ${className}` : ''}`} style={style}>
      {isOpen ? '▲' : '▼'}
    </div>
  )
}