import type { FC } from "react";
import styles from "./Input.module.css";

interface IInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  label?: string;
  note?: string;
  classWrapper?: string;
  classLabel?: string;
  classInput?: string;
  classNote?: string;
  required?: boolean
}

export const Input: FC<IInputProps> = ({ label, classInput, classWrapper, classLabel, classNote, note, value, setValue, placeholder = "", required = false }) => {
  const classes = {
    wrapper: `${styles.wrapper} ${classWrapper || ''}`,
    label: `${styles.label} ${classLabel || ''}`,
    input: `${styles.input} ${classInput || ''}`,
    note: `${styles.note} ${classNote || ''}`
  };

  const id = `${label?.toLowerCase()}_input`;

  return (
    <div className={classes.wrapper}>
      {label && <label htmlFor={id} className={classes.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={classes.input}
        required={required}
      />
      {note && <p className={classes.note}>
        {note}
      </p>}
    </div>
  )
};