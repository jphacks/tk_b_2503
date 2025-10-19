import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: ["src/**/*.stories.{js,jsx,ts,tsx}", "src/**/*.mdx"],
  ignoreBinaries: ["only-allow"],
};

export default config;
