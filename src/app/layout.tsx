import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";

import "./globals.css";
import { getDefaultMetadata } from "#/libs/metadata/metadata";

const mPlusRounded1c = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = getDefaultMetadata();

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja" className={mPlusRounded1c.className}>
      <body>
        <div className="app-container">
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
