import type { ButtonHTMLAttributes } from "react";

import styles from "./button.module.css";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) => {
  const combinedClassName = [styles.button, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      data-variant={variant}
      data-size={size}
      className={combinedClassName}
    />
  );
};

export default Button;
