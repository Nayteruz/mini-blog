import type { ChangeEvent, FC } from "react";
import styles from "./Input.module.css";

interface IInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  note?: string;
  classWrapper?: string;
  classLabel?: string;
  classInput?: string;
  classNote?: string;
  required?: boolean
}

export const Input: FC<IInputProps> = ({ label = 'input', classInput, classWrapper, classLabel, classNote, note, value, onChange, placeholder = "", required = false }) => {
  const classes = {
    wrapper: `${classWrapper || 'input'}`,
    label: `${styles.label} ${classLabel || ''}`,
    input: `${styles.input} ${classInput || ''}`,
    note: `${styles.note} ${classNote || ''}`
  };

  const id = `${label?.toLowerCase()}_input`;

  return (
    <div className={classes.wrapper}>
      {label && label !== 'input' && <label htmlFor={id} className={classes.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
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