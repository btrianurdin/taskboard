import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import { Config } from "tailwindcss";

/**
 * @type {Config}
 */
const config = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["lucide", "heroicons"]),
    }),
  ],
};

export default config;
