import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AturDuitLu - Personal Finance Management",
    short_name: "AturDuitLu",
    description: "Platform Personal Finance Management & Expense Tracking Platform",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#1E5BF6",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
