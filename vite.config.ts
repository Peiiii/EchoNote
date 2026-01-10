import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "echonote-icon-modern.svg",
        "echonote-icon-simple.svg",
        "echonote-icon.svg",
      ],
      manifest: {
        name: "StillRoot - Where Thoughts Take Root",
        short_name: "StillRoot",
        description: "AI-powered note taking application with intelligent features",
        theme_color: "#f0f0ef",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "pwa-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-72x72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-96x96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-128x128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-152x152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-384x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any",
          },
        ],
        shortcuts: [
          {
            name: "New Note",
            short_name: "New Note",
            description: "Create a new note",
            url: "/?action=new-note",
            icons: [
              {
                src: "pwa-96x96.png",
                sizes: "96x96",
              },
            ],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    strictPort: false,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200, // keep an eye on bundle size while avoiding noisy warnings
    rollupOptions: {
      output: {
        // Split large deps into dedicated chunks to avoid one huge index chunk
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          // In pnpm, paths look like: node_modules/.pnpm/pkg@ver/node_modules/pkg/...
          // Use the last occurrence of node_modules to get the real package
          const nm = "node_modules/";
          const idx = id.lastIndexOf(nm);
          if (idx === -1) return undefined;
          const sub = id.slice(idx + nm.length);
          const segs = sub.split("/");
          const pkg = segs[0].startsWith("@") ? `${segs[0]}/${segs[1]}` : segs[0];

          // Framework core
          if (pkg === "react" || pkg === "react-dom") return "react-vendor";
          if (pkg === "react-router-dom") return "router";

          // Agent chat (can be heavy)
          if (pkg === "@agent-labs/agent-chat") return "agent-chat";

          // Editor / ProseMirror family
          if (
            pkg === "zenmark-editor" ||
            pkg === "@benrbray/prosemirror-math" ||
            pkg.startsWith("prosemirror-")
          ) {
            return "editor";
          }

          // Markdown + math rendering
          if (
            pkg === "react-markdown" ||
            pkg === "remark-gfm" ||
            pkg === "remark-math" ||
            pkg === "rehype-katex" ||
            pkg === "katex"
          ) {
            return "markdown";
          }

          // Data + utils
          if (pkg === "firebase") return "firebase";
          if (pkg === "rxjs") return "rxjs";
          if (pkg === "lodash-es") return "lodash";

          // AI SDK
          if (pkg === "ai" || pkg === "@ai-sdk/openai" || pkg === "openai") return "ai-sdk";

          // UI libs
          if (pkg.startsWith("@radix-ui/")) return "radix";
          if (pkg === "lucide-react") return "icons";
          if (
            pkg === "class-variance-authority" ||
            pkg === "clsx" ||
            pkg === "tailwind-merge"
          ) {
            return "ui-utils";
          }

          // Fallback: split by package to avoid one mega vendor chunk
          const safe = pkg
            .replace(/^@/, "at-")
            .replaceAll("/", "-")
            .replaceAll(".", "-")
            .replaceAll("_", "-");
          return `pkg-${safe}`;
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
