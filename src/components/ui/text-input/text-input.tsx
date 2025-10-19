"use client";

import { forwardRef } from "react";

import styles from "./text-input.module.css";

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
  hint?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "className"
>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { id, label, value, onChange, className = "", error, hint, ...inputProps },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    const inputClassName = `${styles.input} ${error ? styles.inputError : ""} ${className}`;

    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {inputProps.required && <span className={styles.required}>必須</span>}
        </label>

        <input
          {...inputProps}
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          className={inputClassName}
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

TextInput.displayName = "TextInput";
