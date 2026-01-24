import { defineConfig } from "vite";

import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        onas: resolve(__dirname, "o-nas.html"),
        proces: resolve(__dirname, "proces-spoluprace.html"),
        produkty: resolve(__dirname, "produkty.html"),
        montaz: resolve(__dirname, "montaz.html"),
        inspiracie: resolve(__dirname, "inspiracie.html"),
      },
    },
  },
});
