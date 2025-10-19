import type { FC } from "react";

import styles from "./color-picker.module.css";

type BackgroundColor =
  | "FF4548"
  | "FD785B"
  | "FDB51C"
  | "27A157"
  | "0A74A2"
  | "B563BC";

type ColorPickerProps = {
  selectedColor: BackgroundColor;
  onColorChange: (color: BackgroundColor) => void;
};

const COLORS: BackgroundColor[] = [
  "FF4548",
  "FD785B",
  "FDB51C",
  "27A157",
  "0A74A2",
  "B563BC",
];

const COLOR_LABELS: Record<BackgroundColor, string> = {
  FF4548: "赤",
  FD785B: "オレンジ",
  FDB51C: "黄色",
  "27A157": "緑",
  "0A74A2": "青",
  B563BC: "紫",
};

export const ColorPicker: FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>背景色</label>
      <div className={styles.colorGrid}>
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.colorButton} ${selectedColor === color ? styles.selected : ""}`}
            style={{ backgroundColor: `#${color}` }}
            onClick={() => onColorChange(color)}
            aria-label={COLOR_LABELS[color]}
            aria-pressed={selectedColor === color}
          >
            {selectedColor === color && (
              <span className={styles.checkmark}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
