import type { ChangeEvent, FC } from "react";
import styles from "./Input.module.css";

interface IInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const Input: FC<IInputProps> = props => {
  const { value, onChange, className, placeholder = "", required = false } = props;

  return (
    <input
      type='text'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${styles.Input} ${className || ""}`}
      required={required}
    />
  );
};
