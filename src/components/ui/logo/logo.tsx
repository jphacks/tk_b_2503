import Image from "next/image";
import Link from "next/link";

import styles from "./logo.module.css";

import { getSession } from "#/clients/auth/server";

type LogoProps = {
  withText?: boolean;
};

export const Logo = async ({ withText = false }: LogoProps) => {
  const session = await getSession();
  const sessionUser = session.user;

  return (
    <Link href={`/users/${sessionUser.id}`} className={styles.cn}>
      <Image
        src="/logo.webp"
        alt=""
        width={48}
        height={48}
        className={styles.logoImg}
      />
      {withText && <h1 className={styles.logoText}>Haru</h1>}
    </Link>
  );
};
