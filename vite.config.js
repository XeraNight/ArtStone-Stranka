import { defineConfig } from "vite";

import { resolve } from "path";

export default defineConfig({
  base: "/ArtStone-Stranka/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        onas: resolve(__dirname, "o-nas.html"),
        proces: resolve(__dirname, "proces-spoluprace.html"),
        produkty: resolve(__dirname, "produkty.html"),
        montaz: resolve(__dirname, "montaz.html"),
        realizacie: resolve(__dirname, "realizacie.html"),
        inspiracie: resolve(__dirname, "inspiracie.html"),
        technicke: resolve(__dirname, "technicke-parametre.html"),
        kontakt: resolve(__dirname, "kontakt.html"),
      },
    },
  },
});
