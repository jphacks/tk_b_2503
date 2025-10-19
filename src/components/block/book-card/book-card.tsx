import Link from "next/link";

import styles from "./book-card.module.css";

type BookCardProps = {
  type: "new" | "own" | "search";
  title: string;
  subtitle: string;
  href: string;
};

const BookCard = ({ type, title, subtitle, href }: BookCardProps) => {
  return (
    <Link href={href} className={styles.card} data-book-type={type}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.cardIcon}>
        <span className={styles.icon}>
          {type === "new" && "📖"}
          {type === "own" && "📚"}
          {type === "search" && "🔍"}
        </span>
      </div>
    </Link>
  );
};

export default BookCard;
