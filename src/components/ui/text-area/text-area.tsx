"use client";

import { forwardRef } from "react";

import styles from "./text-area.module.css";

type TextAreaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
  hint?: string;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange" | "className"
>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      className = "",
      error,
      hint,
      ...textareaProps
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    };

    const textareaClassName = `${styles.textarea} ${
      error ? styles.textareaError : ""
    } ${className}`;

    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {textareaProps.required && <span className={styles.required}>*</span>}
        </label>

        <textarea
          {...textareaProps}
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          className={textareaClassName}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />

        {hint && !error && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}

        {error && (
          <p id={`${id}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
