import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        outDir: "dist-cdn",
        emptyOutDir: true,
        lib: {
            entry: "src/webcomponent.ts",
            name: "CookieConsent",              // global (pas obligatoire mais ok)
            fileName: () => "cookie-consent.js",
            formats: ["iife"]
        }
    }
});
