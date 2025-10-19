import { redirect } from "next/navigation";

import { getSession } from "#/clients/auth/server";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <main>{children}</main>;
};

export default ProtectedLayout;
