import IconSection from "./_components/icon-section";
import LogoutSection from "./_components/logout-section";
import PasswordSection from "./_components/password-section";
import styles from "./page.module.css";

import { getSession } from "#/clients/auth/server";
import { Logo } from "#/components/ui/logo/logo";

const SettingsPage = async () => {
  const session = await getSession();

  return (
    <div>
      <div className={styles.logoCn}>
        <Logo withText />
      </div>
      <IconSection initialIconUrl={session.user.image ?? ""} />
      <PasswordSection />
      <LogoutSection />
    </div>
  );
};

export default SettingsPage;
