import type { FC, ReactNode } from "react";
import styles from './ListRow.module.css'


interface IListRowProps {
  children: ReactNode;
  label?: string;
  required?: boolean
  className?: string
  note?: string;
}

export const ListRow: FC<IListRowProps> = ({ children, label, required, note, className }) => {

  return (
    <div className={`${styles.ListRow} ${className || ''}`}>
      {label && <label className={styles.label}>{label} {required && <span className={styles.required}>*</span>}</label>}
      {children}
      {note && <p className={styles.note}>{note}</p>}
    </div>
  )
}