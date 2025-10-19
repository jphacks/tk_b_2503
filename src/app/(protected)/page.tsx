import { redirect } from "next/navigation";

import { getSession } from "#/clients/auth/server";

const HomePage = async () => {
  const session = await getSession();

  if (session && session.user) {
    redirect(`/users/${session.user.id}`);
  }

  return null;
};

export default HomePage;
