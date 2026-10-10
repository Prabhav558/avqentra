"use client";
import dynamic from "next/dynamic";

// three.js is loaded client-side only, after the page is interactive
const Scene = dynamic(() => import("./Scene3D"), { ssr: false, loading: () => null });
export default Scene;
