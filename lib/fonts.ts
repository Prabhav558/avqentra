import { Archivo, JetBrains_Mono } from "next/font/google";

// Archivo's width axis gives us the extended display cut (font-stretch: 125%).
export const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
