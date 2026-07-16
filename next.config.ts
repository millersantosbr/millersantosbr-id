import type { NextConfig } from "next";

const isFirebaseExport = process.env.FIREBASE_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isFirebaseExport
    ? {
        output: "export" as const,
        typescript: {
          tsconfigPath: "tsconfig.firebase.json",
        },
      }
    : {}),
};

export default nextConfig;
