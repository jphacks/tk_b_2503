import RegisterForm from "./_components/register-form";
import styles from "./page.module.css";

const RegisterPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div>
          <h2 className={styles.title}>アカウントを作成</h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
