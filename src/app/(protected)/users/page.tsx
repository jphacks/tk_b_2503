import UserSearch from "./_components/user-search";
import styles from "./page.module.css";

const UsersPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ユーザー検索</h1>
      <p className={styles.description}>
        ユーザー名でユーザーを検索してプロフィールを表示できます
      </p>

      <UserSearch />
    </div>
  );
};

export default UsersPage;
