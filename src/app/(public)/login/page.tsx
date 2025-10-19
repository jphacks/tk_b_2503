import LoginForm from "./_components/login-form";
import styles from "./page.module.css";

const LoginPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <h2 className={styles.title}>アカウントにログイン</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
